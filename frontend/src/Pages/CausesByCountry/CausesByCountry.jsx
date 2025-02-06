import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Pagination,
  Grid,
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CauseCard from "../../components/CausesComponents/CauseCard";
import { getCausesByCountry } from "../../DataFetching/DataFetching";

const CausesByCountry = () => {
  const { country } = useParams();
  const [causes, setCauses] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Responsive settings
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const causesPerPage = isMobile ? 4 : 6;

  useEffect(() => {
    const fetchCauses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCausesByCountry(
          country,
          page - 1,
          causesPerPage
        );
        setCauses(response.data.data.content);
        setTotalPages(response.data.data.totalPages);
        setTotalElements(response.data.data.totalElements);
      } catch (err) {
        setError(err.message || "An error occurred while fetching causes");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCauses();
  }, [country, page, causesPerPage]);

  // Handle page change
  const handlePageChange = (event, value) => {
    setPage(value);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isLoading) {
    return (
      <Container maxWidth="lg">
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg">
        <Box my={4}>
          <Alert severity="error">{error}</Alert>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      {/* Header Section */}
      <Box
        py={6}
        textAlign="center"
        sx={{
          background: "linear-gradient(to right, #f5f5f5, #ffffff)",
          borderRadius: "16px",
          mb: 4,
        }}>
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
          }}>
          Causes in {country.charAt(0).toUpperCase() + country.slice(1)}
        </Typography>
        <Typography
          variant="subtitle1"
          color="text.secondary"
          sx={{ maxWidth: "600px", mx: "auto" }}>
          Discover and support meaningful causes that make a difference in{" "}
          {country}
        </Typography>
        {totalElements > 0 && (
          <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 2 }}>
            Found {totalElements} cause{totalElements !== 1 ? "s" : ""}
          </Typography>
        )}
      </Box>

      {/* Main Content */}
      {causes.length === 0 ? (
        <Box textAlign="center" my={8}>
          <Typography variant="h6" color="text.secondary">
            No causes found for {country}
          </Typography>
        </Box>
      ) : (
        <>
          {/* Causes Grid */}
          <Grid container spacing={3} mb={4}>
            {causes.map((cause) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={cause.id}
                sx={{
                  transition: "transform 0.2s",
                  "&:hover": {
                    transform: "translateY(-4px)",
                  },
                }}>
                <CauseCard
                  causeId={cause?.id}
                  causeFeaturedImageUrl={cause?.featuredImageUrl}
                  causeTitle={cause?.title}
                  causeDescription={cause?.description}
                  causeCategory={cause?.category}
                  causeCountry={cause?.country}
                  causeGoalAmount={cause?.goalAmount}
                  causeCurrentAmount={cause?.currentAmount}
                  causeOrganization={cause?.organization}
                  causeDonorCount={cause?.donorCount}
                  causeViewCount={cause?.viewCount}
                  causeEndDate={cause?.endDate}
                  causeStatus={cause?.status}
                />
              </Grid>
            ))}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box
              display="flex"
              justifyContent="center"
              my={6}
              sx={{
                "& .MuiPagination-ul": {
                  gap: 1,
                },
              }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size={isMobile ? "medium" : "large"}
                showFirstButton
                showLastButton
                sx={{
                  "& .MuiPaginationItem-root": {
                    fontSize: isMobile ? "0.875rem" : "1rem",
                  },
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default CausesByCountry;
