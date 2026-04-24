import api from "#api/api.ts";

const TestConnection = () => {
  api
    .get("/test")
    .then((response: any) => {
      console.log("API Test Response:", response.data);
    })
    .catch((error: any) => {
      console.error("API Test Error:", error);
    });
};
TestConnection();
