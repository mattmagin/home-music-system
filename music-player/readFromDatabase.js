import axios from "axios";

const readFromDatabase = async (tableId) => {
  return axios({
    url: `http://192.168.1.243:8080/api/database/rows/table/${tableId}/?user_field_names=true`,
    headers: {
      Authorization: "Token WkBKurgAT3LKroY4ohn6Z6d7bxGpFuHH",
    },
  })
    .then((response) => {
      return response.data.results;
    })
    .catch((error) => {
      throw error;
    });
};

export default readFromDatabase;
