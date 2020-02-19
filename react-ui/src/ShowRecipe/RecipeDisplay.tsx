/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import noImage from '../Shared/noImage.png';
import {
  Box,
  Typography,
  Divider,
} from '@material-ui/core/';
import { isAdmin } from '../Shared/AppBehaviors';
import { RecipeAPI } from '../Shared/RecipeAPI';
//@ts-ignore
import { useParams } from 'react-router-dom';
import {
  PrintButton,
  AddToShoppingListButton,
  EditRecipeButton
} from '../Shared/Components/CustomButtons';
import { Loading } from '../Shared/Components/Loading';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    flexBasis: '33.33%',
    flexShrink: 0
  },
  secondaryHeading: {
    fontSize: theme.typography.pxToRem(15),
    color: theme.palette.text.secondary
  },
  details: {
    flexDirection: 'column'
  }
}));

const isMobile = () => {
  return window.orientation !== undefined;
};

const getLayout = () =>
  isMobile()
    ? {
        style: { height: '80%', width: '80%', border: '1px' },
        flexDirection: 'column',
        alignItems: 'center'
      }
    : {
        style: { height: '30%', width: '30%', border: '1px' },
        flexDirection: 'row',
        alignItems: 'top'
      };

interface LongListProps {
  content: any;
  title: string;
  numbered?: boolean;
}

export const LongList = ({
  content,
  title,
  numbered = false
}: LongListProps) => {
  const classes = useStyles();

  const getLine = (index: number, line: any) => {
    if (!numbered || !line) return line;
    const val = Math.floor(index / 2 + 1);
    return `${val}. ${line}`;
  };
  const processedContent = content.split('\n').map((line: any, i: number) => {
    return (
      <Box mt="10px" key={i}>
        <Typography className={classes.secondaryHeading}>
          {getLine(i, line)}
        </Typography>
      </Box>
    );
  });
  return (
    <Box mt="20px" mb="20px">
      <Typography variant="h2">{title}</Typography>
      {processedContent}
    </Box>
  );
};

export const RecipeDisplay = () => {
  //@ts-ignore
  const [recipe, setRecipe] = useState<Recipe>({});
  const [loading, setLoading] = useState(true);
  const { recipeId } = useParams();
  const [responsive] = useState(getLayout());

  useEffect(() => {
    RecipeAPI.getRecipe(recipeId).then(recipe => {
      setRecipe(recipe);
      setLoading(false);
    });
  }, []);
  
  const onError = (ev: { target: any }) => {
    const eventTarget = ev.target;
    eventTarget.src = noImage;
  };

  const [Container, RecipeDetails] = [Box, Box];
  const tags = [recipe.type, recipe.mainIngredient, recipe.region];
  console.log('recipe details from display', recipe);
  if (loading) return <Loading />
  return (
    <Container
      mt="50px"
      width="100%"
      display="flex"
      flexDirection={responsive.flexDirection}
      justifyContent="center"
      alignItems={responsive.alignItems}
    >
      <img
        onError={onError}
        src={recipe.picture || noImage}
        alt={'a tasty dish'}
        style={responsive.style}
      />
      <RecipeDetails ml="30px" mr="20px" display="flex" flexDirection="column">
        <Box display="flex" flexDirection="row">
          <h2>{recipe.title}</h2>
          <AddToShoppingListButton recipe={recipe} />
          <PrintButton label="Recipe" />
          {isAdmin() && <EditRecipeButton id={recipe.id} />}
        </Box>
        <Box display="flex" mb="10px">
          <div>{`from: ${recipe.source || 'unknown'}`}</div>
          <Box ml="auto">{tags.map(tag => !!tag && `#${tag} `)}</Box>
        </Box>
        <Divider />
        <Box mt="10px" display="flex" flexDirection="column">
          <div>{`Yield: ${recipe.serves || 'unknown'}`}</div>
          <div>{`Time: ${recipe.time || 'unknown'}`}</div>
          <div>{`NetCarbs: ${recipe.netCarbs || 'unknown'}`}</div>
          <div>{`Main Ingredient: ${recipe.mainIngredient || 'unknown'}`}</div>
          <div>{`Region: ${recipe.region || 'unknown'}`}</div>
        </Box>

        <Box mt="10px" display="flex" flexDirection="column">
          <LongList
            title="Ingredients"
            content={recipe.ingredients || 'unknown'}
          />
          <LongList
            title="Directions"
            content={recipe.directions || 'unknown'}
            numbered
          />
        </Box>
      </RecipeDetails>
    </Container>
  );
};
