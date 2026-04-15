import { useState } from 'react';
import { Product } from '../../domain/entities/Product';
import { ProductRepository } from '../../domain/repositories/ProductRepository';
import { useRepository } from '../di/RepositoryContext';

export interface ProductFormFields {
    id: string;
    name: string;
    description: string;
    logo: string;
    date_release: string;
    date_revision: string;
}

export interface FormErrors {
    id?: string;
    name?: string;
    description?: string;
    logo?: string;
    date_release?: string;
    date_revision?: string;
    general?: string;
}

export interface UseProductFormOptions {
    mode: 'create' | 'edit';
    initialValues?: ProductFormFields;
    onSuccess: () => void;
}

export interface UseProductFormResult {
    fields: ProductFormFields;
    errors: FormErrors;
    submitting: boolean;
    setField: (field: keyof ProductFormFields, value: string) => void;
    submit: () => Promise<void>;
    reset: () => void;
}

const EMPTY_FIELDS: ProductFormFields = {
    id: '',
    name: '',
    description: '',
    logo: '',
    date_release: '',
    date_revision: '',
};

export function addOneYear(dateStr: string): string {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return '';
    const d = new Date(dateStr + 'T00:00:00');
    if (isNaN(d.getTime())) return '';
    d.setFullYear(d.getFullYear() + 1);
    return d.toISOString().split('T')[0];
}

export function todayIso(): string {
    return new Date().toISOString().split('T')[0];
}

export function useProductForm(
    {
        mode,
        initialValues,
        onSuccess,
    }: UseProductFormOptions,
    repo?: ProductRepository,
): UseProductFormResult {
    const contextRepo = useRepository();
    const repository = repo ?? contextRepo;
    const [fields, setFields] = useState<ProductFormFields>(
        initialValues ?? EMPTY_FIELDS,
    );
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const setField = (field: keyof ProductFormFields, value: string) => {
        setFields((prev) => {
            const updated = { ...prev, [field]: value };
            if (field === 'date_release' && value) {
                updated.date_revision = addOneYear(value);
            }
            return updated;
        });
        setErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = async (): Promise<boolean> => {
        const errs: FormErrors = {};

        if (mode === 'create') {
            if (!fields.id || fields.id.length < 3 || fields.id.length > 10) {
                errs.id = 'El ID debe tener entre 3 y 10 caracteres';
            } else {
                const exists = await repository.verifyId(fields.id);
                if (exists) {
                    errs.id = 'ID no válido';
                }
            }
        }

        if (!fields.name || fields.name.length < 5 || fields.name.length > 100) {
            errs.name = 'El nombre debe tener entre 5 y 100 caracteres';
        }

        if (
            !fields.description ||
            fields.description.length < 10 ||
            fields.description.length > 200
        ) {
            errs.description = 'La descripción debe tener entre 10 y 200 caracteres';
        }

        if (!fields.logo) {
            errs.logo = 'Este campo es requerido!';
        }

        if (!fields.date_release) {
            errs.date_release = 'Este campo es requerido!';
        } else if (fields.date_release < todayIso()) {
            errs.date_release = 'La fecha debe ser igual o mayor a hoy';
        }

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const submit = async (): Promise<void> => {
        const valid = await validate();
        if (!valid) return;

        setSubmitting(true);
        try {
            if (mode === 'create') {
                await repository.create(fields as Product);
            } else {
                const { id, ...rest } = fields;
                await repository.update(id, rest);
            }
            onSuccess();
        } catch (err) {
            setErrors((prev) => ({
                ...prev,
                general: (err as Error).message,
            }));
        } finally {
            setSubmitting(false);
        }
    };

    const reset = () => {
        setFields(initialValues ?? EMPTY_FIELDS);
        setErrors({});
    };

    return { fields, errors, submitting, setField, submit, reset };
}
