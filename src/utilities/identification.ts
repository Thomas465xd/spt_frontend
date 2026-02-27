/** Supported ID types — must match backend enum `Identifications` */
export type IdType = "RUT" | "RUC" | "NIT";

/** Supported countries — must match backend enum `Countries` */
export type Country = "Chile" | "Peru" | "Colombia";

// Mappings

const idTypeToCountry: Record<IdType, Country> = {
    RUT: "Chile",
    RUC: "Peru",
    NIT: "Colombia",
};

const countryToIdType: Record<Country, IdType> = {
    Chile: "RUT",
    Peru: "RUC",
    Colombia: "NIT",
};

export function getCountryForIdType(idType: IdType): Country {
    return idTypeToCountry[idType];
}

export function getIdTypeForCountry(country: Country): IdType {
    return countryToIdType[country];
}

// Labels

interface IdLabels {
    personal: string;
    business: string;
    personalPlaceholder: string;
    businessPlaceholder: string;
}

const labelsByIdType: Record<IdType, IdLabels> = {
    RUT: {
        personal: "RUT Personal",
        business: "RUT Empresa",
        personalPlaceholder: "Ej. 12.345.678-9",
        businessPlaceholder: "Ej. 76.123.456-7",
    },
    RUC: {
        personal: "RUC Personal",
        business: "RUC Empresa",
        personalPlaceholder: "Ej. 10456789012",
        businessPlaceholder: "Ej. 20123456789",
    },
    NIT: {
        personal: "NIT Personal",
        business: "NIT Empresa",
        personalPlaceholder: "Ej. 123.456.789-0",
        businessPlaceholder: "Ej. 900.123.456-7",
    },
};

export function getIdLabels(idType: IdType): IdLabels {
    return labelsByIdType[idType];
}

// Max lengths

const maxLengths: Record<IdType, { personal: number; business: number }> = {
    RUT: { personal: 12, business: 12 },
    RUC: { personal: 11, business: 11 },
    NIT: { personal: 15, business: 15 },
};

export function getMaxLength(idType: IdType, field: "personal" | "business"): number {
    return maxLengths[idType][field];
}

// Formatting (while typing)

/**
 * Formats a Chilean RUT as the user types.
 * Input: raw digits + optional K → Output: `12.345.678-K`
 */
function formatRUTInput(value: string): string {
    const cleaned = value.replace(/[^0-9kK]/g, "").toUpperCase();
    if (cleaned.length <= 1) return cleaned;

    const verifier = cleaned.slice(-1);
    let numbers = cleaned.slice(0, -1);

    // Add thousands separators
    numbers = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${numbers}-${verifier}`;
}

/**
 * Formats a Peruvian RUC — only digits, max 11 chars.
 */
function formatRUCInput(value: string): string {
    return value.replace(/\D/g, "").slice(0, 11);
}

/**
 * Formats a Colombian NIT as the user types.
 * Input: raw digits → Output: `900.123.456-7`
 */
function formatNITInput(value: string): string {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 1) return cleaned;

    const verifier = cleaned.slice(-1);
    let numbers = cleaned.slice(0, -1);

    numbers = numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ".");

    return `${numbers}-${verifier}`;
}

const formatters: Record<IdType, (value: string) => string> = {
    RUT: formatRUTInput,
    RUC: formatRUCInput,
    NIT: formatNITInput,
};

/**
 * Format an identification value based on the ID type.
 * Used for on-the-fly formatting as the user types.
 */
export function formatId(value: string, idType: IdType): string {
    return formatters[idType](value);
}

// ─── Validation patterns ────────────────────────────────────────

interface IdValidation {
    pattern: RegExp;
    message: string;
}

const validationPatterns: Record<IdType, IdValidation> = {
    RUT: {
        pattern: /^\d{1,2}\.?\d{3}\.?\d{3}-[\dkK]$/,
        message: "Formato de RUT inválido. Ejemplo: 12.345.678-9",
    },
    RUC: {
        pattern: /^\d{8,11}$/,
        message: "Formato de RUC inválido. Debe tener entre 8 y 11 dígitos",
    },
    NIT: {
        pattern: /^\d{1,3}\.?\d{3}\.?\d{3}-?\d$/,
        message: "Formato de NIT inválido. Ejemplo: 123.456.789-0",
    },
};

export function getValidation(idType: IdType): IdValidation {
    return validationPatterns[idType];
}

/**
 * Convenience: format a display value (already stored/formatted) based on idType.
 * If the value is already formatted, it returns it as-is.
 */
export function formatDisplayId(value: string, idType: IdType): string {
    if (!value) return "";
    return formatters[idType](value);
}

/**
 * Get a generic label for an ID type — useful in admin contexts
 * where you need to display the type name.
 */
export function getIdTypeName(idType: IdType): string {
    return idType; // "RUT", "RUC", "NIT" — already human-readable
}

/** All supported ID types for dropdown rendering */
export const ID_TYPES: { value: IdType; label: string; country: Country }[] = [
    { value: "RUT", label: "RUT (Chile)", country: "Chile" },
    { value: "RUC", label: "RUC (Perú)", country: "Peru" },
    { value: "NIT", label: "NIT (Colombia)", country: "Colombia" },
];
