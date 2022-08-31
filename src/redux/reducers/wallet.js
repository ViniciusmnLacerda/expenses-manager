import {
  AMOUNT, CLOSE, CURRENCY, EDIT, ED_EXP, EXPENSE, FSD_ED, OPEN, RM_EXPENSE, TO_RENDER
} from '../actions';

const INITIAL_STATE = {
  currencies: [],
  expenses: [],
  editor: false,
  idToEdit: 0,
  error: null,
  areYouEditing: false,
  whoIsBeingEdited: 0,
  amount: '0.00',
  areYouAdding: false,
  expenseToRender: [],
  idToRender: 0,
};

// eslint-disable-next-line default-param-last
function wallet(state = INITIAL_STATE, action) {
  switch (action.type) {
    case CURRENCY:
      return { ...state, currencies: action.payload };
    case EXPENSE:
      return { ...state, expenses: [...state.expenses, action.payload] };
    case AMOUNT:
      return { ...state, amount: action.payload };
    case RM_EXPENSE:
      return {
        ...state,
        expenses: state.expenses.filter((expense) => expense.id !== action.payload.id),
        expenseToRender: [],
      };
    case ED_EXP:
      return { ...state, areYouEditing: true };
    case FSD_ED:
      return { ...state, areYouEditing: false, expenses: action.payload };
    case EDIT:
      return { ...state, whoIsBeingEdited: action.payload };
    case CLOSE:
      return { ...state, areYouAdding: false };
    case OPEN:
      return { ...state, areYouAdding: true };
    case TO_RENDER:
      return {
        ...state, expenseToRender: [state.expenses[action.payload]], idToRender: action.payload,
      };
    default:
      return state;
  }
}

export default wallet;
