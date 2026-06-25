import { RecipeCard } from "./RecipeCard";
import { Grid, Typography, Pagination, Box } from "@mui/material";
import { IRecipe } from "../Shared/Types";
import { Loading } from "../Shared/Components/Loading";
import { SearchOff } from "@mui/icons-material";
import { useMobileQuery } from "../Shared/Hooks/isMobile";

interface Props {
  recipes: IRecipe[];
  loading: boolean;
  page: number;
  onPageChange: (page: number) => void;
}

export const RecipeList = ({ loading, recipes, page, onPageChange }: Props) => {
  const isMobile = useMobileQuery();

  const handleChange = (_: any, value: number) => {
    onPageChange(value);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const pageRecipes = recipes.slice((page - 1) * 30, page * 30);

  if (loading) return <Loading />;

  return (
    <Grid container direction="column" alignItems="center">
      <Grid
        container
        justifyContent={isMobile ? "space-evenly" : undefined}
        alignContent="flex-start"
        spacing={isMobile ? 2 : 4}
        style={{
          width: "100%",
          maxWidth: "100%",
          marginTop: "12px",
          minHeight: "calc(100vh - 175px)",
          paddingLeft: "12px",
          paddingRight: "12px",
          paddingBottom: "80px",
        }}
      >
        {!recipes.length && (
          <Box
            sx={{
              width: "100%",
              minHeight: "calc(100vh - 250px)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 1.5,
              color: "text.disabled",
            }}
          >
            <SearchOff sx={{ fontSize: 56 }} />
            <Typography variant="h6" fontWeight={500}>
              No matching recipes
            </Typography>
            <Typography variant="body2">
              Try adjusting your search or filters
            </Typography>
          </Box>
        )}
        {pageRecipes.map((recipe) => (
          <Grid size={{ xs: 6, sm: 4, md: 3, lg: 2, xl: 2 }} key={recipe.id}>
            <RecipeCard recipe={recipe} />
          </Grid>
        ))}
      </Grid>
      {Math.ceil(recipes.length / 30) > 1 && (
        <Box
          sx={{
            position: "sticky",
            bottom: 16,
            width: "100%",
            display: "flex",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <Box
            sx={{
              bgcolor: "background.paper",
              borderRadius: 4,
              boxShadow: 6,
              px: 2,
              py: 1,
              pointerEvents: "auto",
            }}
          >
            <Pagination
              count={Math.ceil(recipes.length / 30)}
              page={page}
              color="primary"
              shape="rounded"
              size={isMobile ? "small" : "large"}
              onChange={handleChange}
              sx={{ display: "flex" }}
            />
          </Box>
        </Box>
      )}
    </Grid>
  );
};
