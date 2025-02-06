package causebankgrp.causebank.Services.EmailService.EmailTemplate;

import java.util.Map;

import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import lombok.RequiredArgsConstructor;

// dev config
@Service
@RequiredArgsConstructor
public class EmailTemplateService {
    private final SpringTemplateEngine templateEngine;
    private final Environment environment;

    public String generateEmailContent(String templateName, Map<String, Object> templateModel) {
        Context context = new Context();
        context.setVariables(templateModel);
        return templateEngine.process(templateName, context);
    }

    public String getAppUrl() {
        return environment.getProperty("app.url", "http://localhost:8081");
    }
}
