import { database } from "./db.js";
import { testDatabaseConnection } from "../controller/api_controller.js";

export const getUsers = async () => {
  const userRepository = testDatabaseConnection(database); 
  return {
    userRepository,
  };
};