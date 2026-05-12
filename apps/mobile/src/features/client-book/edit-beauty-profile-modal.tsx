import React, { useEffect, useState } from "react";
import { Text } from "react-native";

import {
  FormField,
  MultiSelectField,
  PickerField,
  SubmitButton,
} from "@/components/ui/form-field";
import { Modal } from "@/components/ui/modal";
import { useTheme } from "@/hooks/use-theme";
import type { BeautyProfile } from "@/types";
import { useUpdateBeautyProfile } from "./hooks/use-clients";

const SKIN_TYPES = [
  { value: "dry", label: "Seca" },
  { value: "oily", label: "Grasa" },
  { value: "combination", label: "Mixta" },
  { value: "sensitive", label: "Sensible" },
  { value: "normal", label: "Normal" },
];

const SKIN_TONES = [
  { value: "fair", label: "Clara" },
  { value: "light", label: "Ligera" },
  { value: "medium", label: "Media" },
  { value: "tan", label: "Bronceada" },
  { value: "deep", label: "Profunda" },
];

const SKIN_SUBTONES = [
  { value: "cool", label: "Frío" },
  { value: "neutral", label: "Neutro" },
  { value: "warm", label: "Cálido" },
];

const SKIN_CONCERNS = [
  { value: "acne", label: "Acné" },
  { value: "aging", label: "Anti-edad" },
  { value: "pigmentation", label: "Pigmentación" },
  { value: "dryness", label: "Resequedad" },
  { value: "sensitivity", label: "Sensibilidad" },
  { value: "pores", label: "Poros" },
  { value: "dark_circles", label: "Ojeras" },
  { value: "redness", label: "Rojez" },
];

const FRAGRANCE_PREFS = [
  { value: "floral", label: "Floral" },
  { value: "woody", label: "Amaderado" },
  { value: "citrus", label: "Cítrico" },
  { value: "oriental", label: "Oriental" },
  { value: "fresh", label: "Fresco" },
  { value: "gourmand", label: "Gourmand" },
];

const ROUTINE_TYPES = [
  { value: "morning", label: "Mañana" },
  { value: "night", label: "Noche" },
  { value: "both", label: "Ambas" },
];

const INTERESTS = [
  { value: "skincare", label: "Skincare" },
  { value: "makeup", label: "Makeup" },
  { value: "fragrance", label: "Fragancia" },
];

interface Props {
  visible: boolean;
  onClose: () => void;
  customerId: string;
  beautyProfile: BeautyProfile | null;
  onSuccess: () => void;
}

export function EditBeautyProfileModal({
  visible,
  onClose,
  customerId,
  beautyProfile,
  onSuccess,
}: Props) {
  const theme = useTheme();
  const { mutate, isLoading, error } = useUpdateBeautyProfile(customerId);

  const [skinType, setSkinType] = useState(beautyProfile?.skinType ?? "");
  const [skinTone, setSkinTone] = useState(beautyProfile?.skinTone ?? "");
  const [skinSubtone, setSkinSubtone] = useState(beautyProfile?.skinSubtone ?? "");
  const [skinConcerns, setSkinConcerns] = useState<string[]>(beautyProfile?.skinConcerns ?? []);
  const [preferredIngredients, setPreferredIngredients] = useState(
    (beautyProfile?.preferredIngredients ?? []).join(", ")
  );
  const [avoidedIngredients, setAvoidedIngredients] = useState(
    (beautyProfile?.avoidedIngredients ?? []).join(", ")
  );
  const [fragrancePreferences, setFragrancePreferences] = useState<string[]>(
    beautyProfile?.fragrancePreferences ?? []
  );
  const [routineType, setRoutineType] = useState(beautyProfile?.routineType ?? "");
  const [interests, setInterests] = useState<string[]>(beautyProfile?.interests ?? []);

  useEffect(() => {
    if (visible && beautyProfile) {
      setSkinType(beautyProfile.skinType ?? "");
      setSkinTone(beautyProfile.skinTone ?? "");
      setSkinSubtone(beautyProfile.skinSubtone ?? "");
      setSkinConcerns(beautyProfile.skinConcerns ?? []);
      setPreferredIngredients((beautyProfile.preferredIngredients ?? []).join(", "));
      setAvoidedIngredients((beautyProfile.avoidedIngredients ?? []).join(", "));
      setFragrancePreferences(beautyProfile.fragrancePreferences ?? []);
      setRoutineType(beautyProfile.routineType ?? "");
      setInterests(beautyProfile.interests ?? []);
    }
  }, [visible, beautyProfile]);

  const parseCSV = (str: string): string[] =>
    str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

  const handleSubmit = async () => {
    const result = await mutate({
      ...(skinType ? { skinType } : {}),
      ...(skinTone ? { skinTone } : {}),
      ...(skinSubtone ? { skinSubtone } : {}),
      skinConcerns,
      preferredIngredients: parseCSV(preferredIngredients),
      avoidedIngredients: parseCSV(avoidedIngredients),
      fragrancePreferences,
      ...(routineType ? { routineType } : {}),
      interests,
    });

    if (result) {
      onSuccess();
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title="Editar perfil de belleza"
      footer={
        <SubmitButton
          label="Guardar"
          onPress={handleSubmit}
          loading={isLoading}
        />
      }
    >
      {error && <Text style={{ color: theme.danger }}>{error}</Text>}

      <PickerField
        label="Tipo de piel"
        options={SKIN_TYPES}
        value={skinType}
        onChange={setSkinType}
      />

      <PickerField
        label="Tono"
        options={SKIN_TONES}
        value={skinTone}
        onChange={setSkinTone}
      />

      <PickerField
        label="Subtono"
        options={SKIN_SUBTONES}
        value={skinSubtone}
        onChange={setSkinSubtone}
      />

      <MultiSelectField
        label="Preocupaciones"
        options={SKIN_CONCERNS}
        value={skinConcerns}
        onChange={setSkinConcerns}
      />

      <FormField
        label="Ingredientes preferidos"
        value={preferredIngredients}
        onChangeText={setPreferredIngredients}
        placeholder="Retinol, Niacinamida, Ácido hialurónico..."
      />

      <FormField
        label="Ingredientes a evitar"
        value={avoidedIngredients}
        onChangeText={setAvoidedIngredients}
        placeholder="Alcohol, Parabenos, Fragancias..."
      />

      <MultiSelectField
        label="Preferencias de fragancia"
        options={FRAGRANCE_PREFS}
        value={fragrancePreferences}
        onChange={setFragrancePreferences}
      />

      <PickerField
        label="Tipo de rutina"
        options={ROUTINE_TYPES}
        value={routineType}
        onChange={setRoutineType}
      />

      <MultiSelectField
        label="Intereses"
        options={INTERESTS}
        value={interests}
        onChange={setInterests}
      />
    </Modal>
  );
}
