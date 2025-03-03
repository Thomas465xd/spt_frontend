import { isAxiosError } from "axios";
import api from "@/lib/axios";
import { UserUpdatePasswordForm, UserProfileForm, UserShippingForm } from "../types";

// Update user profile name and email
export async function updateProfile(formData: UserProfileForm) {
    try {
        const url = `/auth/profile/update`;
        const { data } = await api.patch(url, formData);
        //console.log(data)

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            //console.log(error)
            throw new Error(error.response.data.message);
        }
    }
}

// Update Shipping Info
export async function updateShippingInfo(formData: UserShippingForm) {
    try {
        const url = `/auth/profile/update-shipping-info`;
        const { data } = await api.patch(url, formData);

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            //console.log(error)
            throw new Error(error.response.data.message);
        }
    }
}

// Update user password
export async function changePassword(formData: UserUpdatePasswordForm) {
    try {
        const url = `/auth/profile/update-password`;
        const { data } = await api.patch(url, formData);
        //console.log(data)

        return data;
    } catch (error) {
        if (isAxiosError(error) && error.response) {
            //console.log(error)
            throw new Error(error.response.data.message);
        }
    }
}