import React from 'react';
import { Tooltip, IconButton } from '@material-ui/core';
import AddShoppingCart from '@material-ui/icons/AddShoppingCart';
import Print from '@material-ui/icons/Print';
import Edit from '@material-ui/icons/Edit';
import { ShoppingListBehaviors } from '../../ShoppingList/ShoppinglistBehaviors';
import SnackbarService from '../SnackbarService';

//@ts-ignore
export const PrintButton = ({ label }) => {
  return (
    <Tooltip title={`Print ${label}`}>
      <IconButton onClick={window.print}>
        <Print />
      </IconButton>
    </Tooltip>
  );
};
//@ts-ignore
export const AddToShoppingListButton = ({ recipe }) => {
  const addToShoppingList = () => {
    ShoppingListBehaviors.add(recipe);
    SnackbarService.success('added to list!');
  };
  return (
    <Tooltip title="Add to Shopping List">
      <IconButton onClick={addToShoppingList}  aria-label="add to list">
        <AddShoppingCart />
      </IconButton>
    </Tooltip>
  );
};
//@ts-ignore
export const EditRecipeButton = ({id}) => {
  return (
    <Tooltip title="Edit Recipe">
      <IconButton href={`/r/${id}/edit`} aria-label="edit recipe">
        <Edit />
      </IconButton>
    </Tooltip>
  );
};
