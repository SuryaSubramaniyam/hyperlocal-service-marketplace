import { Dialog } from "@headlessui/react";
import { useForm } from "react-hook-form";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

export default function BookingModal({ service, onClose }) {
  const { register, handleSubmit, reset } = useForm();
  const { token } = useAuth();
  const [status, setStatus] = useState("idle");
  const submit = async (data) => {
    setStatus("submitting");
    try {
      await API.post(
        "/bookings",
        { ...data, serviceId: service._id },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus("success");
      reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <Dialog open onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen bg-black/50">
        <Dialog.Panel className="bg-white rounded-2xl p-6 w-full max-w-md space-y-4">
          <Dialog.Title className="text-xl font-bold">
            Book&nbsp;{service.title}
          </Dialog.Title>

          {status === "success" ? (
            <p className="text-green-600">Booking confirmed! 🎉</p>
          ) : (
            <form onSubmit={handleSubmit(submit)} className="space-y-4">
              <input
                type="date"
                {...register("date", { required: true })}
                className="input-field"
              />
              <input
                type="time"
                {...register("time", { required: true })}
                className="input-field"
              />
              <textarea
                placeholder="Address / Notes"
                {...register("address", { required: true })}
                className="input-field"
              />

              {status === "error" && (
                <p className="text-red-500 text-sm">
                  Booking failed. Try again.
                </p>
              )}

              <button
                disabled={status === "submitting"}
                className="w-full  bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-60"
              >
                {status === "submitting" ? "Submitting…" : "Confirm Booking"}
              </button>
            </form>
          )}

          <button
            onClick={onClose}
            className="block w-full text-center text-gray-500 mt-2"
          >
            Close
          </button>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
