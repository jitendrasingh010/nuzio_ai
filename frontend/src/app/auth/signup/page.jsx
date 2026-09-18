"use client";

import React, { useState } from "react";
import { usersignup } from "../../services/authServices";

const Signup = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(">>>>>", data);

      const response = await usersignup(data);

      console.log("Signup response:", response);
    } catch (error) {
      console.log("Signup error:", error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="name"
          value={data.name}
          onChange={(e) =>
            setData({ ...data, name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="email"
          value={data.email}
          onChange={(e) =>
            setData({ ...data, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="password"
          value={data.password}
          onChange={(e) =>
            setData({ ...data, password: e.target.value })
          }
        />

        <button type="submit">Signup</button>
      </form>
    </div>
  );
};

export default Signup;