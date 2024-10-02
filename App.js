import { MyContextControllerProvider } from "./store";
import { firestore, auth } from "./firebaseConfig";
import { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import Router from "./routers/Router";

const App = () => {
  const USERS = firestore.collection("USERS");
  const admin = {
    fullName: "Admin",
    email: "vanhuudhsp@gmail.com",
    password: "123456",
    phone: "091313732",
    address: "Binh Duong",
    role: "admin",
  };

  useEffect(() => {
    // Đăng ký tài khoản admin
    const registerAdmin = async () => {
      try {
        const userCredential = await auth.createUserWithEmailAndPassword(
          admin.email,
          admin.password
        );
        const user = userCredential.user;
        await USERS.doc(user.uid).set(admin);
        console.log("Admin registered successfully");
      } catch (error) {
        console.error("Error registering admin: ", error);
      }
    };

    registerAdmin();
  }, []);

  return (
    <MyContextControllerProvider>
      <NavigationContainer>
        <Router />
      </NavigationContainer>
    </MyContextControllerProvider>
  );
};

export default App;
