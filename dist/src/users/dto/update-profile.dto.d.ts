declare class AddressDto {
    street?: string;
    city?: string;
    country?: string;
    postalCode?: string;
}
export declare class UpdateProfileDto {
    firstName?: string;
    lastName?: string;
    phone?: string;
    institution?: string;
    designation?: string;
    profilePhoto?: string;
    address?: AddressDto;
    extendedProfile?: Record<string, any>;
}
export {};
