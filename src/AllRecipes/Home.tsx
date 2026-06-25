/* eslint-disable react-hooks/exhaustive-deps */
import { useState, useEffect, useRef, useCallback, ChangeEvent } from "react";
import {
  Box,
  Paper,
  Divider,
  IconButton,
  InputBase,
  Tooltip,
} from "@mui/material";
import { Close, Search } from "@mui/icons-material";
import { IRecipe, emptyFilters } from "../Shared/Types";
import { RecipeAPI } from "../Shared/APIs/RecipeAPI";
import { AdvancedFilters } from "./AdvancedFilters";
import { RecipeList } from "./RecipeList";
import { RecipeTransform } from "./RecipeTransform";
import { ShowFiltersChip } from "./ShowFiltersChip";
import { useNavigate, useLocation } from "react-router-dom";
import { grey } from "@mui/material/colors";
import { getLocalRecipes, storeLocalRecipes } from "../Shared/AppBehaviors";

export const Home = () => {
  const [recipes, setRecipes] = useState<IRecipe[]>(getLocalRecipes());
  const [filteredRecipes, setFilteredRecipes] = useState<IRecipe[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedFilters, setSelectedFilters] = useState(emptyFilters);
  const [searchTerm, setSearchTerm] = useState("");
  const [filtersExpanded, setFiltersExpanded] = useState(false);
  const [page, setPage] = useState<number>(
    () => (location.state as any)?.page ?? 1,
  );

  useEffect(() => {
    RecipeAPI.getAllRecipes().then((recipes) => {
      storeLocalRecipes(recipes);
      setRecipes(recipes);
      setFilteredRecipes(recipes);
      setLoading(false);
      if (location.state) {
        setPage((location.state as any).page ?? 1);
        setSelectedFilters(location.state as any);
        setSearchTerm((location.state as any).debouncedSearchTerm);
        if (
          (location.state as any).mainIngredient ||
          (location.state as any).region ||
          (location.state as any).type ||
          (location.state as any).source ||
          (location.state as any).rating
        ) {
          setFiltersExpanded(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    const newFilteredRecipes = RecipeTransform.filterRecipes(
      recipes,
      selectedFilters,
    );
    if (
      JSON.stringify(filteredRecipes) !== JSON.stringify(newFilteredRecipes)
    ) {
      setFilteredRecipes(newFilteredRecipes);
    }
    if (!loading) {
      navigate("/all", { state: { ...selectedFilters, page } });
    }
  }, [selectedFilters, recipes, page]);

  const debounceTimer = useRef<ReturnType<typeof setTimeout> | undefined>(
    undefined,
  );
  const setDebouncedSearchTerm = useCallback((debouncedSearchTerm: string) => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSelectedFilters((prev) => ({
        ...prev,
        debouncedSearchTerm,
      }));
    }, 500);
  }, []);

  const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
    setPage(1);
    setSearchTerm(event.target.value);
    setDebouncedSearchTerm(event.target.value);
  };

  const clearInput = () => {
    setPage(1);
    setSearchTerm("");
    setDebouncedSearchTerm("");
    setSelectedFilters(emptyFilters);
  };

  const handleSetSelectedFilters: typeof setSelectedFilters = (value) => {
    setPage(1);
    setSelectedFilters(value);
  };

  const isPristine =
    !searchTerm &&
    JSON.stringify(selectedFilters) === JSON.stringify(emptyFilters);

  return (
    <>
      <Paper
        elevation={0}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: (theme) =>
            theme.palette.mode === "dark" ? grey[900] : "white",
          borderBottom: (theme) =>
            `1px solid ${theme.palette.mode === "dark" ? grey[800] : grey[200]}`,
          pb: filtersExpanded ? 1 : 0,
        }}
      >
        <Box
          sx={{
            mt: { xs: 1.5, md: 2 },
            mb: 1.5,
            display: "flex",
            alignItems: "center",
            width: { xs: "90%", sm: "60%", md: "50%", lg: "40%" },
            borderRadius: "12px",
            border: (theme) =>
              `1.5px solid ${theme.palette.mode === "dark" ? grey[700] : grey[300]}`,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? grey[800] : grey[50],
            px: 1,
            transition:
              "border-color 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease",
            "&:hover": {
              backgroundColor: (theme) =>
                theme.palette.mode === "dark" ? grey[700] : grey[100],
            },
            "&:focus-within": {
              borderColor: "primary.main",
              boxShadow: (theme) =>
                `0 0 0 3px ${theme.palette.mode === "dark" ? "rgba(144,202,249,0.15)" : "rgba(25,118,210,0.1)"}`,
            },
          }}
        >
          <Search
            sx={{ color: "text.disabled", mr: 0.5, fontSize: "1.2rem" }}
          />
          <InputBase
            sx={{ flex: 1, fontSize: "0.95rem" }}
            placeholder="Search recipes…"
            inputProps={{ "aria-label": "search" }}
            value={searchTerm}
            onChange={handleChangeInput}
          />
          {!isPristine && (
            <Tooltip title="Clear search and filters">
              <IconButton size="small" onClick={clearInput} aria-label="clear">
                <Close fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          <Divider sx={{ height: 20, mx: 0.5 }} orientation="vertical" />
          <ShowFiltersChip
            expanded={filtersExpanded}
            setExpanded={setFiltersExpanded}
          />
        </Box>
        <AdvancedFilters
          expanded={filtersExpanded}
          selectedFilters={selectedFilters}
          setSelectedFilters={handleSetSelectedFilters}
        />
      </Paper>
      <RecipeList
        loading={!recipes.length}
        recipes={filteredRecipes}
        page={page}
        onPageChange={setPage}
      />
    </>
  );
};
