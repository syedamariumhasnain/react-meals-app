import { useState, useCallback } from "react";

const useHttp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const sendRequest = useCallback(async (requestConfig, applyData = () => {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(requestConfig.url, {
        method: requestConfig.method ? requestConfig.method : "GET",
        headers: requestConfig.headers ? requestConfig.headers : {},
        body: requestConfig.body ? JSON.stringify(requestConfig.body) : null,
      });

      if (!response.ok) {
        throw new Error("Request failed!");
      }

      // we have to check for error before getting json(),
      // cuz, if we don't get response, this line will through error
      // json data not found, so we have to check error before.
      const data = await response.json();

      // here, we can do 2 things; either we can pass a function to do
      // something with data or just return data

      // --- 1 ---
      // applyData(data);

      // --- 2 ---
      setIsLoading(false);
      return data;
    } catch (error) {
      setIsLoading(false);
      setError(error.message || "Something went wrong!");
    }
  }, []);

  const clearError = () => {
    setError(null);
  };

  return {
    isLoading,
    error,
    sendRequest,
    clearError,
  };
};

export default useHttp;

// ---------------------
// Making "GET" Request:
// ---------------------

// import useHttp ...

// ... INSIDE COMPONENT

// const [tasks, setTasks] = useState([]);

// const { isLoadng, error, sendRequest: fetchTasks } = useHttp();

// useEffect(() => {
//  const transformTasks = tasksObj => {
//   const loadedTasks = [];
//
//   for (const taskKey in tasksObj) {
//     loadedTasks.push({ id: taskKey, test: tasksObj[taskKey].text });
//   }
//
//   setTasks(loadedTasks);
//  };
//
//  fetchTasks(
//    { url: "https://react-http-6b4a6.firebaseio.com/tasks.json" },
//    transformTasks,
//   );
// }, [fetchTasks]);

// ----------------------
// Making "POST" Request:
// ----------------------

// import useHttp ...

// ... INSIDE COMPONENT

// const { isLoadng, error, sendRequest: sendTaskRequest } = useHttp();

// const createTask = (taskText, taskData) => {
//   const generatedId = taskData.name;
//   const createdTask = { id: generatedId, text: taskText };
//   props.onAddTask(createdTask);
// }

// const submitTaskHandler = async (taskText) => {
//  sendTaskRequest(
//    {
//      url: "https://react-http-6b4a6.firebaseio.com/tasks.json",
//      method: "POST",
//      headers: {
//        "Content-Type": "application.json",
//      },
//      body: { text: taskText }
//    },

//    // bind method takes first arg. "this" keyword, which can
//    // be null in our case. taskText is a pre-configured arg.
//    // any other arg. passed to the function where it is called
//    // (in applyData(data) of useHttp hook) will appended to the
//    // end of parameter list, so will be appended as second arg.
//    // to createTask function

//    createTask.bind(null, taskText)
//  );
// };
