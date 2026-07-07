import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import type { UserDto } from "../../services/api";
import { userApi, ApiError } from "../../services/api";
import { isValidFullName, isValidCity, isValidPhoneNumber,} from "../../utils/validators";
import "./CompleteProfileModal.css";

interface CompleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: UserDto) => void | Promise<void>;
}

const ERROR_MESSAGES: Record<string, string> = {
  INVALID_FULLNAME: "Please enter your name.",
  INVALID_PHONE: "Use valid format: +373 60 123 456 or 060 123 456.",
  INVALID_CITY: "Invalid location.",
  USER_NOT_FOUND: "Your session has expired. Please sign in again.",
};

function CompleteProfileModal({
  isOpen,
  onClose,
  onSave,
}: CompleteProfileModalProps) {
  const { user } = useAuth();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  // Esc closes the dialog
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Re-seed the form from the session user each time the modal opens.
  useEffect(() => {
    if (!isOpen) return;
    setFullName(user?.fullName ?? "");
    setPhone(user?.phoneNumber ?? "");
    setCity(user?.city ?? "");
    setErrors({});
  }, [isOpen, user]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!isValidFullName(fullName)) e.fullName = "Please enter your name.";
    if (!phone.trim()) e.phone = "Phone number is required to publish.";
    else if (!isValidPhoneNumber(phone))
      e.phone = "Use valid format: +373 60 123 456 or 060 123 456.";
    if (!city.trim()) e.city = "City is required to publish.";
    else if (!isValidCity(city)) e.city = "Invalid location.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;
    setSubmitting(true);
    try {
      const res = await userApi.updateProfile({
        fullName: fullName.trim(),
        phoneNumber: phone.trim(),
        city: city.trim(),
      });
      if (!res.isSuccess || !res.user) {
        setErrors({
          form:
            ERROR_MESSAGES[res.errorCode ?? ""] ??
            res.message ??
            "Could not save your profile.",
        });
        return;
      }
      await onSave(res.user);
    } catch (err) {
      const code =
        err instanceof ApiError &&
        err.details &&
        typeof err.details === "object"
          ? (err.details as { errorCode?: string }).errorCode
          : undefined;
      setErrors({
        form:
          ERROR_MESSAGES[code ?? ""] ??
          (err instanceof Error ? err.message : "Could not save your profile."),
      });
    } finally {
      setSubmitting(false);
    }
  };
  if (!isOpen) return null;

  return (
    <div className="cpm-overlay" onClick={onClose}>
      <div
        className="cpm-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="cpm-title" className="cpm-title">
          Complete your profile
        </h2>
        <p className="cpm-subtitle">
          Buyers need a way to reach you. Add your contact details to publish.
        </p>

        {errors.form && (
          <div className="cpm-err cpm-err--form" role="alert">
            {errors.form}
          </div>
        )}

        <div className="cpm-field">
          <label className="cpm-label">Email</label>
          <input
            className="cpm-input"
            value={user?.email ?? ""}
            readOnly
            disabled
          />
        </div>

        <div className="cpm-field">
          <label className="cpm-label" htmlFor="cpm-fullname">
            Full name
          </label>
          <input
            id="cpm-fullname"
            className="cpm-input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            autoComplete="name"
            autoFocus
          />
          {errors.fullName && <div className="cpm-err">{errors.fullName}</div>}
        </div>

        <div className="cpm-field">
          <label className="cpm-label" htmlFor="cpm-phone">
            Phone number
          </label>
          <input
            id="cpm-phone"
            className="cpm-input"
            type="tel"
            placeholder="+373 60 123 456"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
          />
          {errors.phone && <div className="cpm-err">{errors.phone}</div>}
        </div>

        <div className="cpm-field">
          <label className="cpm-label" htmlFor="cpm-city">
            City
          </label>
          <input
            id="cpm-city"
            className="cpm-input"
            placeholder="Chisinau"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            autoComplete="address-level2"
          />
          {errors.city && <div className="cpm-err">{errors.city}</div>}
        </div>

        <div className="cpm-actions">
          <button
            type="button"
            className="cpm-btn cpm-btn--ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="cpm-btn cpm-btn--primary"
            onClick={handleSave}
            disabled={submitting}
          >
            {submitting ? "Saving…" : "Save and Publish"}
          </button>
        </div>
      </div>
    </div>
  );
}
export default CompleteProfileModal;
