import React, { createContext, useReducer, useContext } from "react";

const MessageStateContext = createContext();
const MessageDispatchContext = createContext();

const messageReducer = (state = { users: [], selectedUser: "" }, action) => {
  let usersCopy, userIndex;
  const { username = "", message = {}, messages = [] } = action.payload;
  switch (action.type) {
    case "SET_USERS":
      console.log(action.payload);
      return {
        ...state,
        users: action.payload,
      };
    case "SET_USER_MESSAGES":
      usersCopy = [...state.users];

      userIndex = usersCopy.findIndex((u) => u.username === username);

      usersCopy[userIndex] = { ...usersCopy[userIndex], messages };

      return {
        ...state,
        users: usersCopy,
      };
    case "SET_SELECTED_USER":
      usersCopy = state.users.map((user) => {
        const currRead = user.read;
        return {
          ...user,
          selected: user.username === action.payload,
          read: user.username === action.payload ? true : currRead,
        };
      });

      return {
        ...state,
        users: usersCopy,
        selectedUser: action.payload,
      };
    // case "TOGGLE_READ":

    case "ADD_MESSAGE":
      const { selectChat, read } = action.payload;
      usersCopy = [...state.users];

      userIndex = usersCopy.findIndex((u) => u.username === username);

      if (userIndex === -1) {
        if (selectChat) {
          usersCopy.map((user) => ({
            ...user,
            selected: false,
          }));
        }
        usersCopy = [
          { username, messages: [message], selected: selectChat, read },
          ...usersCopy,
        ];
      } else {
        let newUser = {
          ...usersCopy[userIndex],
          messages: usersCopy[userIndex].messages
            ? [...usersCopy[userIndex].messages, message]
            : null,
          latestMessage: message,
          read,
        };
        usersCopy = usersCopy.filter((user) => user.username !== username);
        usersCopy.unshift(newUser);
      }

      return {
        ...state,
        users: usersCopy,
      };
    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
};

export const MessageProvider = ({ children }) => {
  const [state, dispatch] = useReducer(messageReducer, { users: null });

  return (
    <MessageDispatchContext.Provider value={dispatch}>
      <MessageStateContext.Provider value={state}>
        {children}
      </MessageStateContext.Provider>
    </MessageDispatchContext.Provider>
  );
};

export const useMessageState = () => useContext(MessageStateContext);
export const useMessageDispatch = () => useContext(MessageDispatchContext);
