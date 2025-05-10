"use client";

import Navbar from "@/app/components/navbar";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Lock,
  Eye,
  EyeOff,
  Edit2,
  Save,
  X,
  ChevronRight,
  LogOut,
  ShoppingBag,
  Heart,
  CreditCard,
} from "lucide-react";
import Link from "next/link";

// Mock user data
const initialUserData = {
  name: "John Doe",
  email: "john.doe@example.com",
  phone: "+1 (555) 123-4567",
  address: "123 Main Street, Apt 4B, New York, NY 10001",
};

export default function Profile() {
  const [userData, setUserData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);

  // Password states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [changePassword, setChangePassword] = useState(false);

  // Form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    // Validate email
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Validate phone
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }

    // Validate address
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    // Validate password if changing
    if (changePassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Current password is required";
      }

      if (!newPassword) {
        newErrors.newPassword = "New password is required";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password must be at least 8 characters";
      }

      if (!confirmPassword) {
        newErrors.confirmPassword = "Please confirm your password";
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setFormData(userData);
    setChangePassword(false);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setErrors({});
    setChangePassword(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // In a real app, you would send this data to your backend
      setUserData(formData);
      setIsEditing(false);
      setChangePassword(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Show success message (in a real app)
      alert("Profile updated successfully!");
    }
  };

  const [checking, setChecking] = useState(true);
  const router = useRouter();

  interface User {
    name: string;
    email: string;
    phone: string;
    adress: string;
  }

  const [loggedUser, setLoggedUser] = useState<User | null>(null);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      router.push("/auth/login");
    } else {
      setLoggedUser(JSON.parse(user));
      setChecking(false);
    }
  }, [router]);

  if (checking) return null;

  return (
    <div className="bg-white">
      <Navbar />
      <div className="min-h-screen bg-marfil-suave py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Profile header */}
            <div className="bg-azul-noche px-6 py-8">
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <div className="w-24 h-24 bg-dorado-elegante rounded-full flex items-center justify-center text-white text-3xl font-bold mb-4 md:mb-0 md:mr-6">
                  {loggedUser?.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-white">
                    {loggedUser?.name}
                  </h1>
                  <p className="text-gris-medio mt-1">{loggedUser?.email}</p>
                  <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                    {!isEditing && (
                      <button
                        onClick={handleEditClick}
                        className="inline-flex items-center px-4 py-2 bg-dorado-elegante hover:bg-oro-claro text-gris-oscuro rounded-md text-sm font-medium transition-colors"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit Profile
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Profile content */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Left sidebar - Navigation */}
                <div className="md:col-span-1">
                  <nav className="space-y-1">
                    <Link
                      href="/profile"
                      className="flex items-center px-3 py-2 text-sm font-medium rounded-md bg-marfil-suave text-gris-oscuro"
                    >
                      <User className="mr-3 h-5 w-5 text-dorado-elegante" />
                      <span>Profile Information</span>
                      <ChevronRight className="ml-auto h-5 w-5 text-gris-medio" />
                    </Link>

                    <Link href="/auth/login">
                      <div className="pt-4 mt-4 border-t border-gris-medio/20">
                        <button
                          className="flex w-full items-center px-3 py-2 text-sm font-medium rounded-md text-red-500 hover:bg-red-50"
                          onClick={() => {
                            localStorage.removeItem("user");
                            localStorage.removeItem("isLoggedIn");
                          }}
                        >
                          <LogOut className="mr-3 h-5 w-5" />
                          <span>Sign out</span>
                        </button>
                      </div>
                    </Link>
                  </nav>
                </div>

                {/* Right content - Profile information */}
                <div className="md:col-span-2">
                  <div className="bg-white rounded-lg">
                    <div className="px-4 py-5 sm:px-6 border-b border-gris-medio/20">
                      <h3 className="text-lg font-medium leading-6 text-gris-oscuro">
                        {isEditing
                          ? "Edit Profile Information"
                          : "Profile Information"}
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gris-medio">
                        {isEditing
                          ? "Update your personal details below"
                          : "Personal details and contact information"}
                      </p>
                    </div>

                    {isEditing ? (
                      <form
                        onSubmit={handleSubmit}
                        className="px-4 py-5 sm:p-6"
                      >
                        <div className="space-y-6">
                          {/* Name field */}
                          <div>
                            <label
                              htmlFor="name"
                              className="block text-sm font-medium text-gris-oscuro"
                            >
                              Full Name
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <User className="h-5 w-5 text-gris-medio" />
                              </div>
                              <input
                                type="text"
                                name="name"
                                id="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  errors.name
                                    ? "border-red-500"
                                    : "border-gris-medio/30"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                              />
                            </div>
                            {errors.name && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.name}
                              </p>
                            )}
                          </div>

                          {/* Email field */}
                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gris-oscuro"
                            >
                              Email Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Mail className="h-5 w-5 text-gris-medio" />
                              </div>
                              <input
                                type="email"
                                name="email"
                                id="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  errors.email
                                    ? "border-red-500"
                                    : "border-gris-medio/30"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                              />
                            </div>
                            {errors.email && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.email}
                              </p>
                            )}
                          </div>

                          {/* Phone field */}
                          <div>
                            <label
                              htmlFor="phone"
                              className="block text-sm font-medium text-gris-oscuro"
                            >
                              Phone Number
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Phone className="h-5 w-5 text-gris-medio" />
                              </div>
                              <input
                                type="text"
                                name="phone"
                                id="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  errors.phone
                                    ? "border-red-500"
                                    : "border-gris-medio/30"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                              />
                            </div>
                            {errors.phone && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.phone}
                              </p>
                            )}
                          </div>

                          {/* Address field */}
                          <div>
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gris-oscuro"
                            >
                              Address
                            </label>
                            <div className="mt-1 relative rounded-md shadow-sm">
                              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <MapPin className="h-5 w-5 text-gris-medio" />
                              </div>
                              <input
                                type="text"
                                name="address"
                                id="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                className={`block w-full pl-10 pr-3 py-2 border ${
                                  errors.address
                                    ? "border-red-500"
                                    : "border-gris-medio/30"
                                } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                              />
                            </div>
                            {errors.address && (
                              <p className="mt-1 text-sm text-red-500">
                                {errors.address}
                              </p>
                            )}
                          </div>

                          {/* Password change toggle */}
                          <div className="flex items-center">
                            <input
                              id="change-password"
                              name="change-password"
                              type="checkbox"
                              checked={changePassword}
                              onChange={(e) =>
                                setChangePassword(e.target.checked)
                              }
                              className="h-4 w-4 text-dorado-elegante focus:ring-dorado-elegante border-gris-medio/30 rounded"
                            />
                            <label
                              htmlFor="change-password"
                              className="ml-2 block text-sm text-gris-oscuro"
                            >
                              Change password
                            </label>
                          </div>

                          {/* Password fields (conditionally rendered) */}
                          {changePassword && (
                            <div className="space-y-4 border-t border-gris-medio/20 pt-4">
                              {/* Current password */}
                              <div>
                                <label
                                  htmlFor="current-password"
                                  className="block text-sm font-medium text-gris-oscuro"
                                >
                                  Current Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gris-medio" />
                                  </div>
                                  <input
                                    type={
                                      showCurrentPassword ? "text" : "password"
                                    }
                                    name="current-password"
                                    id="current-password"
                                    value={currentPassword}
                                    onChange={(e) =>
                                      setCurrentPassword(e.target.value)
                                    }
                                    className={`block w-full pl-10 pr-10 py-2 border ${
                                      errors.currentPassword
                                        ? "border-red-500"
                                        : "border-gris-medio/30"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                                    placeholder="••••••••"
                                  />
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowCurrentPassword(
                                          !showCurrentPassword
                                        )
                                      }
                                      className="text-gris-medio hover:text-gris-oscuro focus:outline-none"
                                    >
                                      {showCurrentPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {errors.currentPassword && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.currentPassword}
                                  </p>
                                )}
                              </div>

                              {/* New password */}
                              <div>
                                <label
                                  htmlFor="new-password"
                                  className="block text-sm font-medium text-gris-oscuro"
                                >
                                  New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gris-medio" />
                                  </div>
                                  <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="new-password"
                                    id="new-password"
                                    value={newPassword}
                                    onChange={(e) =>
                                      setNewPassword(e.target.value)
                                    }
                                    className={`block w-full pl-10 pr-10 py-2 border ${
                                      errors.newPassword
                                        ? "border-red-500"
                                        : "border-gris-medio/30"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                                    placeholder="••••••••"
                                  />
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowNewPassword(!showNewPassword)
                                      }
                                      className="text-gris-medio hover:text-gris-oscuro focus:outline-none"
                                    >
                                      {showNewPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {errors.newPassword && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.newPassword}
                                  </p>
                                )}
                              </div>

                              {/* Confirm password */}
                              <div>
                                <label
                                  htmlFor="confirm-password"
                                  className="block text-sm font-medium text-gris-oscuro"
                                >
                                  Confirm New Password
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm">
                                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gris-medio" />
                                  </div>
                                  <input
                                    type={
                                      showConfirmPassword ? "text" : "password"
                                    }
                                    name="confirm-password"
                                    id="confirm-password"
                                    value={confirmPassword}
                                    onChange={(e) =>
                                      setConfirmPassword(e.target.value)
                                    }
                                    className={`block w-full pl-10 pr-10 py-2 border ${
                                      errors.confirmPassword
                                        ? "border-red-500"
                                        : "border-gris-medio/30"
                                    } rounded-md focus:outline-none focus:ring-2 focus:ring-dorado-elegante focus:border-dorado-elegante`}
                                    placeholder="••••••••"
                                  />
                                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        setShowConfirmPassword(
                                          !showConfirmPassword
                                        )
                                      }
                                      className="text-gris-medio hover:text-gris-oscuro focus:outline-none"
                                    >
                                      {showConfirmPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                </div>
                                {errors.confirmPassword && (
                                  <p className="mt-1 text-sm text-red-500">
                                    {errors.confirmPassword}
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Form actions */}
                          <div className="flex justify-end space-x-3 pt-4 border-t border-gris-medio/20">
                            <button
                              type="button"
                              onClick={handleCancelClick}
                              className="inline-flex items-center px-4 py-2 border border-gris-medio/30 rounded-md shadow-sm text-sm font-medium text-gris-oscuro bg-white hover:bg-marfil-suave focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dorado-elegante"
                            >
                              <X className="mr-2 h-4 w-4" />
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-gris-oscuro bg-dorado-elegante hover:bg-oro-claro focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-dorado-elegante"
                            >
                              <Save className="mr-2 h-4 w-4" />
                              Save Changes
                            </button>
                          </div>
                        </div>
                      </form>
                    ) : (
                      <div className="px-4 py-5 sm:p-6">
                        <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                              <User className="mr-2 h-4 w-4 text-dorado-elegante" />
                              Full Name
                            </dt>
                            <dd className="mt-1 text-sm text-gris-oscuro">
                              {loggedUser?.name}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                              <Mail className="mr-2 h-4 w-4 text-dorado-elegante" />
                              Email Address
                            </dt>
                            <dd className="mt-1 text-sm text-gris-oscuro">
                              {loggedUser?.email}
                            </dd>
                          </div>
                          <div className="sm:col-span-1">
                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                              <Phone className="mr-2 h-4 w-4 text-dorado-elegante" />
                              Phone Number
                            </dt>
                            <dd className="mt-1 text-sm text-gris-oscuro">
                              {loggedUser?.phone}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                              <MapPin className="mr-2 h-4 w-4 text-dorado-elegante" />
                              Address
                            </dt>
                            <dd className="mt-1 text-sm text-gris-oscuro">
                              {loggedUser?.adress}
                            </dd>
                          </div>
                          <div className="sm:col-span-2">
                            <dt className="text-sm font-medium text-gris-medio flex items-center">
                              <Lock className="mr-2 h-4 w-4 text-dorado-elegante" />
                              Password
                            </dt>
                            <dd className="mt-1 text-sm text-gris-oscuro">
                              ••••••••
                            </dd>
                          </div>
                        </dl>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
