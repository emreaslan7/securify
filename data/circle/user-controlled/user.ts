import axios from "axios";

export const getCircleUserInfoByUserId = async (userId: string) => {
  const options = {
    method: "GET",
    url: `https://api.circle.com/v1/w3s/users/${userId}`,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.CIRCLE_API_KEY}`,
    },
  };

  await axios
    .request(options)
    .then(function (response) {
      return response.data.data.user;
    })
    .catch(function (error) {
      console.error(error);
    });
};
