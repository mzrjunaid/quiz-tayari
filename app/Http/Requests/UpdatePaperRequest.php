<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class UpdatePaperRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => [
                'required',
                'string',
                'max:150',
                'min:3',
            ],
            'description' => [
                'nullable',
                'string',
                'max:255',
            ],
            'testing_services' => [
                'nullable',
                'array',
            ],
            'testing_services.short' => [
                'required_with:testing_services',
                'string',
                'max:10',
                'min:2',
            ],
            'testing_services.long' => [
                'required_with:testing_services',
                'string',
                'max:100',
                'min:5',
            ],
            'department' => [
                'nullable',
                'string',
                'max:150',
            ],
            'subject' => [
                'nullable',
                'string',
                'max:100',
            ],
            'scheduled_at' => [
                'nullable',
                'date',
            ],
        ];
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'title.required' => 'The paper title is required.',
            'title.max' => 'The paper title cannot exceed 150 characters.',
            'title.min' => 'The paper title must be at least 3 characters.',

            'description.max' => 'The description cannot exceed 255 characters.',

            'testing_services.short.required_with' => 'The testing service short name is required when testing service is provided.',
            'testing_services.short.max' => 'The testing service short name cannot exceed 10 characters.',
            'testing_services.short.min' => 'The testing service short name must be at least 2 characters.',

            'testing_services.long.required_with' => 'The testing service full name is required when testing service is provided.',
            'testing_services.long.max' => 'The testing service full name cannot exceed 100 characters.',
            'testing_services.long.min' => 'The testing service full name must be at least 5 characters.',

            'department.in' => 'The selected department is invalid.',
            'department.max' => 'The department name cannot exceed 150 characters.',

            'subject.max' => 'The subject name cannot exceed 100 characters.',

            'scheduled_at.date' => 'The scheduled date must be a valid date.',
        ];
    }

    /**
     * Get custom attributes for validator errors.
     *
     * @return array<string, string>
     */
    public function attributes(): array
    {
        return [
            'testing_services.short' => 'testing service abbreviation',
            'testing_services.long' => 'testing service full name',
            'scheduled_at' => 'scheduled date and time',
        ];
    }

    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        // Clean and format the data before validation
        if ($this->has('title')) {
            $this->merge([
                'title' => trim($this->title),
            ]);
        }

        if ($this->has('description')) {
            $this->merge([
                'description' => $this->description ? trim($this->description) : null,
            ]);
        }

        if ($this->has('department')) {
            $this->merge([
                'department' => $this->department ? trim($this->department) : null,
            ]);
        }

        if ($this->has('subject')) {
            $this->merge([
                'subject' => $this->subject ? trim($this->subject) : null,
            ]);
        }

        // Ensure testing_services is properly formatted
        if ($this->has('testing_services') && is_array($this->testing_services)) {
            $testingServices = $this->testing_services;

            if (isset($testingServices['short'])) {
                $testingServices['short'] = trim($testingServices['short']);
            }

            if (isset($testingServices['long'])) {
                $testingServices['long'] = trim($testingServices['long']);
            }

            $this->merge([
                'testing_services' => $testingServices,
            ]);
        }
    }
    /**
     * Get the validated data with proper formatting.
     *
     * @return array
     */
    public function validated($key = null, $default = null): array
    {
        $validated = parent::validated();

        // Ensure empty strings become null for nullable fields
        $nullableFields = ['description', 'department', 'subject', 'scheduled_at'];

        foreach ($nullableFields as $field) {
            if (isset($validated[$field]) && $validated[$field] === '') {
                $validated[$field] = null;
            }
        }

        // Handle testing_services - if empty array or missing required fields, set to null
        if (isset($validated['testing_services'])) {
            if (
                empty($validated['testing_services']) ||
                !isset($validated['testing_services']['short']) ||
                !isset($validated['testing_services']['long'])
            ) {
                $validated['testing_services'] = null;
            }
        }

        return $validated;
    }
}
