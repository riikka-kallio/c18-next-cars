import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
// import CircularProgress from "@mui/material/CircularProgress";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button } from "@mui/material";

import Car from "@/types/Car";

const schema = yup.object().shape({
  name: yup.string().max(30).required(),
  bhp: yup.number().integer().max(5000).required(),
  avatar_url: yup.string(),
});

export interface formData {
  name: string;
  bhp: string;
  avatar_url: string;
}

export interface CarData {
  name: string;
  bhp: number;
  avatar_url?: string;
}
export interface CarUpdateData {
  name?: string;
  bhp: string;
  avatar_url?: string;
}

const defaults: { name: string; bhp: string; avatar_url: string } = {
  name: "",
  bhp: "",
  avatar_url: "",
};

type addFormFn = (formData: CarData) => Promise<void>;
type updateFormFn = (id: string, formData: CarData) => Promise<void>;

interface CarFormInput {
  car?: Car;
  addCar?: addFormFn;
  updateCar?: updateFormFn;
}

export default function CarForm({ car, addCar, updateCar }: CarFormInput) {
  console.log({ car });

  const {
    handleSubmit,
    formState: { errors, isValid, isDirty, isSubmitting },
    reset,
    control,
  } = useForm({
    // @ts-ignore
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: defaults,
  });

  useEffect(() => {
    // console.log('useeffect', car);
    if (car) {
      const {  avatar_url="", bhp, name } = car;

      reset({
        name,
        bhp: String(bhp),
        avatar_url,
      });
    }
  }, [car, reset]);

  const formRowStyle = {
    marginBlockEnd: "1em",
  };

  const submitFn = (vals: formData) => {
    reset();
    const data: CarData = { ...vals, bhp: Number(vals.bhp) };

    if (car) {
      updateCar?.(car._id, data);
    } else {
      addCar?.(data);
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */
    <form onSubmit={handleSubmit(submitFn)}>
      <div style={formRowStyle}>
        <Controller
          control={control}
          name="name"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              type="name"
              fullWidth
              error={!!errors.name}
              {...field}
              label="name"
              helperText={errors.name?.message}
              required
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="bhp"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              type="text"
              fullWidth
              error={!!errors.bhp}
              {...field}
              label="bhp"
              // pattern={/[0-9]{1,4}/}
              helperText={errors.bhp?.message}
              required
            />
          )}
        />
      </div>

      <div style={formRowStyle}>
        <Controller
          control={control}
          name="avatar_url"
          defaultValue={""}
          render={({ field }) => (
            <TextField
              fullWidth
              type="text"
              error={!!errors.avatar_url}
              {...field}
              label="Avatar URL"
              helperText={errors.avatar_url?.message}
            />
          )}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <Button
          type="reset"
          onClick={() => reset()}
          variant="contained"
          sx={{ mr: 2 }}
          disabled={!isDirty}
        >
          Reset
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isSubmitting || !isDirty || (isDirty && !isValid)}
        >
          Submit
        </Button>
      </div>
    </form>
  );
}
