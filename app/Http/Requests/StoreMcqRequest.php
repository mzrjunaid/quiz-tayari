<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMcqRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true; // Adjust based on your authorization logic
    }

    /**
     * Prepare the data for validation.
     * This runs before validation rules are applied
     */
    protected function prepareForValidation(): void
    {
        $data = $this->all();

        // Process correct_answer if it exists
        if (isset($data['correct_answer']) && is_array($data['correct_answer'])) {
            $correctAnswersArray = array_filter($data['correct_answer']); // Remove empty values

            if (count($correctAnswersArray) === 1) {
                // Single correct answer - convert to string
                $data['correct_answer'] = reset($correctAnswersArray);
                unset($data['correct_answers']); // Remove if exists

            } elseif (count($correctAnswersArray) > 1) {
                // Multiple correct answers - move to correct_answers array
                $data['correct_answers'] = array_values($correctAnswersArray);
                unset($data['correct_answer']); // Remove original

                // Update question_type to multiple if it's single
                if (isset($data['question_type']) && $data['question_type'] === 'single') {
                    $data['question_type'] = 'multiple';
                }
            } else {
                // Empty array - remove the field (will fail validation)
                unset($data['correct_answer']);
            }
        }

        // Replace the request data with processed data
        $this->replace($data);
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        $rules = [
            'question' => 'required|string',
            'explanation' => 'nullable|string',
            'option_a' => 'required|string',
            'option_b' => 'required|string',
            'option_c' => 'nullable|string',
            'option_d' => 'nullable|string',
            'option_e' => 'nullable|string',
            'subject' => 'nullable|string|max:255',
            'topic' => 'nullable|string|max:255',
            'difficulty_level' => 'required|string|in:easy,medium,hard',
            'question_type' => 'required|string|in:single,single_a,multiple,true_false',
            'language' => 'nullable|string|in:en,ur',
            'tags' => 'nullable|array',
            'tags.*' => 'string|max:50',
            'exam_types' => 'nullable|array',
            'exam_types.*' => 'string|max:100',
            'is_active' => 'nullable|boolean',
            'is_verified' => 'nullable|boolean',
            'core_concept' => 'nullable|string|max:255',
            'current_affair' => 'nullable|boolean',
            'general_knowledge' => 'nullable|boolean',
            'is_rephrased_added' => 'nullable|boolean',
        ];

        // Dynamic rules based on question type or presence of correct_answers
        if ($this->input('question_type') === 'multiple' || $this->has('correct_answers')) {
            $rules['correct_answers'] = 'required|array|min:1';
            $rules['correct_answers.*'] = 'string|in:A,B,C,D,E';
        } else {
            $rules['correct_answer'] = 'required|string|in:A,B,C,D,E';
        }

        return $rules;
    }

    /**
     * Get custom error messages for validation rules.
     */
    public function messages(): array
    {
        return [
            'correct_answer.required' => 'A correct answer is required for single answer questions.',
            'correct_answer.in' => 'The correct answer must be one of: A, B, C, D, E.',
            'correct_answers.required' => 'At least one correct answer is required for multiple answer questions.',
            'correct_answers.min' => 'Multiple choice questions must have at least one correct answer.',
            'correct_answers.*.in' => 'Each correct answer must be one of: A, B, C, D, E.',
            'question_type.in' => 'Question type must be one of: single, single_a, multiple, true_false.',
            'difficulty_level.in' => 'Difficulty level must be one of: easy, medium, hard.',
            'language.in' => 'Language must be either: en (English) or ur (Urdu).',
        ];
    }

    /**
     * Get custom attribute names for validation errors.
     */
    public function attributes(): array
    {
        return [
            'option_a' => 'Option A',
            'option_b' => 'Option B',
            'option_c' => 'Option C',
            'option_d' => 'Option D',
            'option_e' => 'Option E',
            'correct_answer' => 'correct answer',
            'correct_answers' => 'correct answers',
            'difficulty_level' => 'difficulty level',
            'question_type' => 'question type',
            'exam_types' => 'exam types',
            'is_active' => 'active status',
            'is_verified' => 'verification status',
            'core_concept' => 'core concept',
            'current_affair' => 'current affair status',
            'general_knowledge' => 'general knowledge status',
            'is_rephrased_added' => 'rephrased status',
        ];
    }

    /**
     * Handle a failed validation attempt.
     * Optional: Customize the validation response
     */
    protected function failedValidation(\Illuminate\Contracts\Validation\Validator $validator)
    {
        // You can customize the failed validation response here if needed
        // For example, to return custom JSON format

        /*
        $response = response()->json([
            'success' => false,
            'message' => 'Validation failed',
            'errors' => $validator->errors(),
            'processed_data' => $this->all(), // Debug: see what data was processed
        ], 422);

        throw new \Illuminate\Validation\ValidationException($validator, $response);
        */

        parent::failedValidation($validator);
    }

    /**
     * Get the validated data with proper structure for database storage.
     * This method can be called after validation passes
     */
    public function getProcessedData(): array
    {
        $validated = $this->validated();

        // Ensure arrays are properly formatted for JSON storage
        if (isset($validated['tags']) && is_array($validated['tags'])) {
            $validated['tags'] = array_values(array_filter($validated['tags']));
        }

        if (isset($validated['exam_types']) && is_array($validated['exam_types'])) {
            $validated['exam_types'] = array_values(array_filter($validated['exam_types']));
        }

        if (isset($validated['correct_answers']) && is_array($validated['correct_answers'])) {
            $validated['correct_answers'] = array_values(array_filter($validated['correct_answers']));
        }

        return $validated;
    }
}
