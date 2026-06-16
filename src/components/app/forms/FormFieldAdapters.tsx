"use client";

import * as Checkbox from "@/components/ui/checkbox";
import * as Hint from "@/components/ui/hint";
import * as Input from "@/components/ui/input";
import * as Label from "@/components/ui/label";
import * as Select from "@/components/ui/select";
import * as Textarea from "@/components/ui/textarea";

type FieldShellProps = {
  children: React.ReactNode;
  error?: string;
  hint?: string;
  label: string;
  required?: boolean;
};

function FieldShell({ children, error, hint, label, required }: FieldShellProps) {
  return (
    <div className="space-y-2">
      <Label.Root>
        {label}
        {required ? <Label.Asterisk /> : null}
      </Label.Root>
      {children}
      {error || hint ? (
        <Hint.Root hasError={Boolean(error)}>
          <span>{error || hint}</span>
        </Hint.Root>
      ) : null}
    </div>
  );
}

type TextFieldProps = {
  error?: string;
  hint?: string;
  label: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  value: string;
};

export function TextField({
  error,
  hint,
  label,
  onBlur,
  onChange,
  placeholder,
  required,
  value,
}: TextFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label} required={required}>
      <Input.Root hasError={Boolean(error)}>
        <Input.Wrapper>
          <Input.Input
            onBlur={onBlur}
            onChange={(event) => onChange(event.target.value)}
            placeholder={placeholder}
            value={value}
          />
        </Input.Wrapper>
      </Input.Root>
    </FieldShell>
  );
}

type TextAreaFieldProps = {
  error?: string;
  hint?: string;
  label: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  value: string;
};

export function TextAreaField({
  error,
  hint,
  label,
  onBlur,
  onChange,
  placeholder,
  value,
}: TextAreaFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label}>
      <Textarea.Root
        hasError={Boolean(error)}
        onBlur={onBlur}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        simple
        value={value}
      />
    </FieldShell>
  );
}

type SelectOption = {
  label: string;
  value: string;
};

type SelectFieldProps = {
  error?: string;
  hint?: string;
  label: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  value: string;
};

export function SelectField({
  error,
  hint,
  label,
  onChange,
  options,
  placeholder,
  required,
  value,
}: SelectFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label} required={required}>
      <Select.Root onValueChange={onChange} value={value || undefined}>
        <Select.Trigger>
          <Select.Value placeholder={placeholder || "Select..."} />
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} value={option.value}>
              {option.label}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </FieldShell>
  );
}

type CheckboxFieldProps = {
  checked: boolean;
  error?: string;
  hint?: string;
  label: string;
  onChange: (nextValue: boolean) => void;
};

export function CheckboxField({
  checked,
  error,
  hint,
  label,
  onChange,
}: CheckboxFieldProps) {
  return (
    <FieldShell error={error} hint={hint} label={label}>
      <div className="flex items-center gap-2">
        <Checkbox.Root
          checked={checked}
          onCheckedChange={(nextValue) => onChange(nextValue === true)}
        />
        <span className="text-paragraph-sm text-text-sub-600">{label}</span>
      </div>
    </FieldShell>
  );
}
