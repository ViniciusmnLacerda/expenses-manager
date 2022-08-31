import { fetchAPI } from '../../services/fetchAPI';

export const USER_EMAIL = 'USER_EMAIL';
export const CURRENCY = 'GET_CURRENCY';
export const EXPENSE = 'GET_EXPENSE';
export const RM_EXPENSE = 'REMOVE_EXPENSE';
export const ED_EXP = 'EDIT_EXPENSE';
export const FSD_ED = 'FINISHED_EDIT';
export const EDIT = 'BEING_EDITED';
export const AMOUNT = 'SET_AMOUNT';

export function userEmail(email) {
  return { type: USER_EMAIL, payload: email };
}

export function getExpense(expense) {
  return { type: EXPENSE, payload: expense };
}

export function removeExpense(id) {
  return { type: RM_EXPENSE, payload: { id } };
}

export function isEditing() {
  return { type: ED_EXP };
}

export function beingEdited(id) {
  return { type: EDIT, payload: id };
}

export function finishedEdit(expenses) {
  return { type: FSD_ED, payload: expenses };
}

export function setAmount(amount) {
  return { type: AMOUNT, payload: amount };
}

function getCurrency(coins) {
  return { type: CURRENCY, payload: coins };
}

export function fetchCoins() {
  return async (dispatch) => {
    try {
      const coins = await fetchAPI();
      dispatch(getCurrency(coins));
    } catch (error) {
      console.log(error);
    }
  };
}
