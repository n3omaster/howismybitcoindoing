"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isValidBtcAddress } from "@/lib/validate";

interface AddressFormProps {
  onSubmit: (address: string) => void;
  loading: boolean;
}

export function AddressForm({ onSubmit, loading }: AddressFormProps) {
  const [address, setAddress] = useState("");
  const [validationError, setValidationError] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = address.trim();

    if (!trimmed) {
      setValidationError("Please enter a Bitcoin address");
      return;
    }

    if (!isValidBtcAddress(trimmed)) {
      setValidationError("Invalid Bitcoin address format");
      return;
    }

    setValidationError("");
    onSubmit(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto">
      <div className="flex gap-3">
        <Input
          type="text"
          placeholder="Enter a Bitcoin address (e.g. bc1q...)"
          value={address}
          onChange={(e) => {
            setAddress(e.target.value);
            if (validationError) setValidationError("");
          }}
          className="flex-1 h-12 text-base font-mono"
          disabled={loading}
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-12 px-6 text-base cursor-pointer"
        >
          {loading ? "Looking up..." : "Look up"}
        </Button>
      </div>
      {validationError && (
        <p className="mt-2 text-sm text-destructive">{validationError}</p>
      )}
    </form>
  );
}
