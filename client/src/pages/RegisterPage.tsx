import { useState } from "react";
import {
  Button,
  PasswordInput,
  TextInput,
  Text,
  List,
  Card,
  Title,
} from "@mantine/core";
import axios from "axios";
import bcrypt from "bcryptjs";
import { useNavigate } from "react-router";
import { LOGIN } from "../routes/routes";
import { API_BASE_URL } from "../config";

type form = {
  username: string;
  password: string;
  confirmPassword: string;
};

const RegisterPage = () => {
  const [formInput, setFormInput] = useState<form>({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [passwordValid, setPasswordValid] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const [error, setError] = useState(false); // Shows the above errors if true (and the above are true)
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(false);

    if (!validatePassword()) {
      setPasswordValid(false);
      setError(true);
    } else {
      setPasswordValid(true);
    }

    if (!matchPasswords()) {
      setPasswordsMatch(false);
      setError(true);
    } else {
      setPasswordsMatch(true);
    }

    if (error) {
      return;
    }

    setLoading(true);
    try {
      const hashedPassword = await bcrypt.hash(formInput.password, 12);
      await axios.post(
        `${API_BASE_URL}/auth/register`,
        {
          username: formInput.username,
          password: hashedPassword,
        },
        { withCredentials: true }
      );
      navigate(LOGIN);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = () => {
    const regex =
      /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@!#&*()])[A-Za-z\d@!#&*()]{8,}$/;
    return regex.test(formInput.password);
  };

  const matchPasswords = () => {
    return formInput.password === formInput.confirmPassword;
  };

  return (
    <>
      <Title order={1} size="h2">
        Register
      </Title>
      <TextInput
        label="Username"
        value={formInput.username}
        onChange={(e) => {
          setError(false);
          setFormInput({ ...formInput, username: e.target.value });
        }}
        error={error && formInput.username === "" ? "Username is required" : ""}
      />
      <PasswordInput
        label="Password"
        value={formInput.password}
        onChange={(e) => {
          setError(false);
          setFormInput({ ...formInput, password: e.target.value });
        }}
        error={
          error && formInput.password === ""
            ? "Password is required"
            : error && !passwordValid
            ? "Password does not match all of criteria"
            : ""
        }
      />
      <Card>
        <Text>Password must:</Text>
        <List>
          <List.Item>be at least 8 characters long</List.Item>
          <List.Item>have an uppercase letter</List.Item>
          <List.Item>have a lowercase letter</List.Item>
          <List.Item>have a digit</List.Item>
          <List.Item>have a symbol from: @ ! # & * ( )</List.Item>
        </List>
      </Card>
      <PasswordInput
        label="Confirm Password"
        value={formInput.confirmPassword}
        onChange={(e) => {
          setError(false);
          setFormInput({ ...formInput, confirmPassword: e.target.value });
        }}
        error={
          error && formInput.confirmPassword === ""
            ? "Confirmation password is required"
            : error && !passwordsMatch
            ? "Passwords do not match"
            : ""
        }
      />
      <Button onClick={handleSubmit} loading={loading}>
        Register
      </Button>
    </>
  );
};

export default RegisterPage;
