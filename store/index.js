import { createContext, useContext, useMemo, useReducer } from "react";
import auth from "../firebaseConfig";
import firestore from "../firebaseConfig";
import { Alert } from "react-native";

// Tạo MyContext
const MyContext = createContext();
MyContext.displayName = "vbdvabv";

// Định nghĩa reducer
const reducer = (state, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { ...state, userLogin: action.value };
    case "LOGOUT":
      return { ...state, userLogin: null };
    default:
      return new Error("Action not found");
  }
};

// Định nghĩa MyContextControllerProvider
const MyContextControllerProvider = ({ children }) => {
  // Khởi tạo store
  const initialState = {
    userLogin: null,
    services: [],
  };

  const [controller, dispatch] = useReducer(reducer, initialState);
  // Phân biệt useMemo và useEffect
  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MyContext.Provider value={value}>{children}</MyContext.Provider>;
};
// Định nghĩa useMyContextController
const useMyContextController = () => {
  const context = useContext(MyContext);
  if (context == null) {
    return new Error(
      "useMyContextController must be inside in MyContextControllerProvider"
    );
  }
  return context;
};

// Định nghĩa các action
const USERS = firestore().collection("USERS");

const login = (dispatch, email, password) => {
  auth()
    .signInWithEmailAndPassword(email, password)
    .then((response) => {
      USERS.doc(email).onSnapshot((u) =>
        dispatch({ type: "USER_LOGIN", value: u.data() })
      );
    })
    .catch((e) => Alert.alert("Sai email và password"));
};

const logout = (dispatch) => {
  auth()
    .signOut()
    .then(() => dispatch({ type: "LOGOUT" }));
};

export { MyContextControllerProvider, useMyContextController, login, logout };
