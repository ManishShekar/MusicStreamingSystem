import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import GraphicEqIcon from "@mui/icons-material/GraphicEq";
import { toast } from "react-toastify";
import { useNavigate, useLocation } from "react-router-dom";
import { loginApi, registerApi } from "@/api/authApi";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/auth/authSlice";

const buildSchema = (mode: "login" | "register") =>
  yup.object({
    userName:
      mode === "register"
        ? yup.string().trim().required("Name is required")
        : yup.string().optional().default(""),
    email: yup.string().email("Enter a valid email").required("Email is required"),
    password:
      mode === "register"
        ? yup.string().min(6, "At least 6 characters").required("Password is required")
        : yup.string().required("Password is required"),
    confirmPassword:
      mode === "register"
        ? yup
            .string()
            .oneOf([yup.ref("password")], "Passwords must match")
            .required("Confirm your password")
        : yup.string().optional().default(""),
  });

type FormValues = yup.InferType<ReturnType<typeof buildSchema>>;

const LoginPage = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: yupResolver(buildSchema(mode)),
    defaultValues: { userName: "", email: "", password: "", confirmPassword: "" },
  });

  const switchMode = (_: unknown, next: "login" | "register" | null) => {
    if (!next) return;
    setMode(next);
    reset({ userName: "", email: "", password: "", confirmPassword: "" });
  };

  const submit = async (values: FormValues) => {
    setSubmitting(true);
    try {
      if (mode === "login") {
        const response = await loginApi({
          email: values.email,
          password: values.password,
        });
        dispatch(setCredentials(response));
        toast.success(`Welcome back, ${response.userName}!`);
        const redirectTo = (location.state as { from?: Location })?.from?.pathname ?? "/";
        navigate(redirectTo, { replace: true });
      } else {
        await registerApi({
          userName: values.userName.trim(),
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
        });
        toast.success("Account created. You can now log in.");
        setMode("login");
        reset({ userName: "", email: values.email, password: "", confirmPassword: "" });
      }
    } catch (err) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data
          ?.message ?? `Failed to ${mode === "login" ? "log in" : "register"}.`;
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
      }}
    >
      <Paper elevation={0} sx={{ p: 4, width: "100%", maxWidth: 420, borderRadius: 3 }}>
        <Stack spacing={1} alignItems="center" sx={{ mb: 3 }}>
          <GraphicEqIcon color="primary" sx={{ fontSize: 40 }} />
          <Typography variant="h5">Music Streamer</Typography>
        </Stack>

        <ToggleButtonGroup
          value={mode}
          exclusive
          onChange={switchMode}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="login">Log in</ToggleButton>
          <ToggleButton value="register">Sign up</ToggleButton>
        </ToggleButtonGroup>

        <form onSubmit={handleSubmit(submit)}>
          <Stack spacing={2.5}>
            {mode === "register" && (
              <Controller
                name="userName"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Full name"
                    fullWidth
                    error={!!errors.userName}
                    helperText={errors.userName?.message}
                  />
                )}
              />
            )}
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Email"
                  type="email"
                  fullWidth
                  error={!!errors.email}
                  helperText={errors.email?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Password"
                  type="password"
                  fullWidth
                  error={!!errors.password}
                  helperText={errors.password?.message}
                />
              )}
            />
            {mode === "register" && (
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    label="Confirm password"
                    type="password"
                    fullWidth
                    error={!!errors.confirmPassword}
                    helperText={errors.confirmPassword?.message}
                  />
                )}
              />
            )}
            <Button type="submit" variant="contained" size="large" disabled={submitting}>
              {mode === "login" ? "Log in" : "Create account"}
            </Button>
          </Stack>
        </form>

     
      </Paper>
    </Box>
  );
};

export default LoginPage;
