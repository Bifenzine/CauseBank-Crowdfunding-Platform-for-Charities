package causebankgrp.causebank.Services.CloudinaryService;

import java.awt.Graphics2D;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.*;
import java.util.stream.Collectors;

import javax.imageio.ImageIO;

import org.apache.commons.io.FilenameUtils;
import org.bytedeco.javacv.*;
import org.bytedeco.ffmpeg.global.avcodec;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;

import jakarta.annotation.PreDestroy;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    private static final long MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
    private static final int MAX_FILES = 5;
    private static final Map<String, String> EXTENSION_TO_RESOURCE_TYPE = Map.of(
            "jpg", "image",
            "jpeg", "image",
            "png", "image",
            "gif", "image",
            "mp4", "video",
            "webm", "video");

    private final ExecutorService executorService = Executors.newFixedThreadPool(5);

    public record UploadResult(String url, String mediaType) {
    }

    public List<UploadResult> uploadFiles(List<MultipartFile> files) {
        validateFiles(files);

        List<CompletableFuture<UploadResult>> futures = files.stream()
                .map(file -> CompletableFuture.supplyAsync(() -> {
                    try {
                        String url = uploadFile(file);
                        String mediaType = isVideo(file) ? "VIDEO" : "IMAGE";
                        return new UploadResult(url, mediaType);
                    } catch (IOException e) {
                        throw new RuntimeException("Failed to upload file: " + file.getOriginalFilename(), e);
                    }
                }, executorService))
                .collect(Collectors.toList());

        return futures.stream()
                .map(CompletableFuture::join)
                .collect(Collectors.toList());
    }

    public String uploadFile(MultipartFile file) throws IOException {
        validateFile(file);

        byte[] compressedData;
        if (isVideo(file)) {
            compressedData = compressVideo(file.getBytes());
        } else {
            compressedData = compressImage(file.getBytes());
        }

        Map<String, Object> params = new HashMap<>();
        params.put("folder", "causebank");
        params.put("resource_type", getResourceType(file));

        Map uploadResult = cloudinary.uploader().upload(compressedData, params);
        return (String) uploadResult.get("secure_url");
    }

    private byte[] compressImage(byte[] imageData) throws IOException {
        BufferedImage originalImage = ImageIO.read(new ByteArrayInputStream(imageData));
        BufferedImage resized = resizeImage(originalImage, 480, 480);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        ImageIO.write(resized, "jpg", outputStream);
        return outputStream.toByteArray();
    }

    private byte[] compressVideo(byte[] videoData) throws IOException {
        File tempInputFile = File.createTempFile("input", ".mp4");
        File tempOutputFile = File.createTempFile("output", ".mp4");

        try {
            Files.write(tempInputFile.toPath(), videoData);

            FFmpegFrameGrabber grabber = new FFmpegFrameGrabber(tempInputFile);
            grabber.start();

            FFmpegFrameRecorder recorder = new FFmpegFrameRecorder(tempOutputFile,
                    grabber.getImageWidth(),
                    grabber.getImageHeight(),
                    grabber.getAudioChannels());

            recorder.setVideoCodec(avcodec.AV_CODEC_ID_H264);
            recorder.setFormat("mp4");
            recorder.setVideoBitrate(1000000);
            recorder.setVideoQuality(23);
            recorder.setFrameRate(30);
            recorder.setAudioCodec(avcodec.AV_CODEC_ID_AAC);
            recorder.setAudioBitrate(128000);
            recorder.start();

            Frame frame;
            while ((frame = grabber.grab()) != null) {
                recorder.record(frame);
            }

            recorder.stop();
            recorder.release();
            grabber.stop();
            grabber.release();

            return Files.readAllBytes(tempOutputFile.toPath());
        } finally {
            tempInputFile.delete();
            tempOutputFile.delete();
        }
    }

    private void validateFiles(List<MultipartFile> files) {
        if (files.size() > MAX_FILES) {
            throw new IllegalArgumentException("Maximum " + MAX_FILES + " files allowed per upload");
        }
        files.forEach(this::validateFile);
    }

    private void validateFile(MultipartFile file) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
        if (!EXTENSION_TO_RESOURCE_TYPE.containsKey(extension)) {
            throw new IllegalArgumentException("Unsupported file type");
        }

        if (file.getSize() > MAX_FILE_SIZE) {
            throw new IllegalArgumentException("File size exceeds maximum limit");
        }
    }

    private String getResourceType(MultipartFile file) {
        String extension = FilenameUtils.getExtension(file.getOriginalFilename()).toLowerCase();
        return EXTENSION_TO_RESOURCE_TYPE.get(extension);
    }

    private boolean isVideo(MultipartFile file) {
        return file.getContentType() != null && file.getContentType().startsWith("video/");
    }

    private BufferedImage resizeImage(BufferedImage originalImage, int targetWidth, int targetHeight) {
        double ratio = Math.min(
                (double) targetWidth / originalImage.getWidth(),
                (double) targetHeight / originalImage.getHeight());

        int width = (int) (originalImage.getWidth() * ratio);
        int height = (int) (originalImage.getHeight() * ratio);

        BufferedImage resizedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
        Graphics2D graphics = resizedImage.createGraphics();
        graphics.drawImage(originalImage, 0, 0, width, height, null);
        graphics.dispose();

        return resizedImage;
    }

    public void deleteFile(String url) throws IOException {
        if (url == null || url.isEmpty()) {
            return;
        }

        String publicId = extractPublicId(url);
        Map<String, String> params = new HashMap<>();
        params.put("resource_type", "image"); // Handles both images and videos

        try {
            cloudinary.uploader().destroy(publicId, params);
        } catch (IOException e) {
            log.error("Failed to delete file from Cloudinary: {}", publicId, e);
            throw e;
        }
    }

    private String extractPublicId(String url) {
        String[] urlParts = url.split("/");
        String filename = urlParts[urlParts.length - 1];
        String folder = urlParts[urlParts.length - 2];
        return folder + "/" + filename.split("\\.")[0];
    }

    @PreDestroy
    public void cleanup() {
        executorService.shutdown();
        try {
            if (!executorService.awaitTermination(60, TimeUnit.SECONDS)) {
                executorService.shutdownNow();
            }
        } catch (InterruptedException e) {
            executorService.shutdownNow();
        }
    }
}