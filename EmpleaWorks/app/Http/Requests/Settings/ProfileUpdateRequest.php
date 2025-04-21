<?php

namespace App\Http\Requests\Settings;

use App\Models\User;
use Auth;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ProfileUpdateRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        $rules = [
            'name' => ['required', 'string', 'max:255'],
            'surname' => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
            'image' => [
                'nullable',
                'image',
                'mimes:jpeg,png,jpg,gif',
                'max:2048',
            ],
            'description' => [
                'nullable',
                'string',
                'max:1000',
            ],
        ];
        
        $user = Auth::user();

        if ($user->isCandidate()) {
            $rules['cv'] = ['required', 'file', 'mimes:pdf,docx,doc', 'max:2048',]; // validacion basica
            $rules['surname'] = ['required', 'string','max:255','regex:/^[a-zA-Z\s]+$/']; // Permite solo letras y espacios
        }

        if ($user->isCompany()) {
            $rules['address'] = ['required','string','max:255','regex:/^[a-zA-Z0-9\s,.-]+$/']; // Permite letras, números, espacios y algunos caracteres especiales
            $rules['weblink'] = ['nullable', 'url', 'max:255', 'regex:/^(https?:\/\/)?(www\.)?[a-zA-Z0-9\-\.]+\.[a-z]{2,}(\/.*)?$/'];
        }

        return $rules;
    }
}
