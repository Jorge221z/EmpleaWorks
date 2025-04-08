import { Offer, Company } from "@/types/types";
import React, { useState } from "react";
import { useForm } from '@inertiajs/react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox"
import { get } from "http";
import { router } from '@inertiajs/react';
const { post } = router;


interface ApplyFormProps {
    offer: Offer;  // Recibimos la oferta como prop
    candidateId: number; // Recibimos el ID del candidato como prop
}

const ApplyForm: React.FC<{ offer: Offer; candidateId: number }> = ({ offer, candidateId }) => {

    const company = offer.company;
    //para poder acceder a cualquier campo de offer simplemente ponemos offer.(propiedad) //

    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [coverLetter, setCoverLetter] = useState("");

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPhoneNumber(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleCoverLetterChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCoverLetter(e.target.value);
    };


    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // aqui podriamos poner un loading para que el usuario vea que se esta enviando la aplicacion//
        try {
            // Crear un objeto FormData apropiado
            const formData = new FormData();
            formData.append('phone', phoneNumber);
            formData.append('email', email);
            formData.append('cl', coverLetter);
            formData.append('offer_id', offer.id.toString());
            formData.append('candidate_id', candidateId.toString());

            post('/apply', formData, {
                forceFormData: true,
                onSuccess: () => {
                    console.log("Form submitted successfully");

                    // Aquí puedes hacer acciones post-éxito, como limpiar el formulario
                    setPhoneNumber("");
                    setEmail("");
                    setCoverLetter("");
                },
                onError: (errors) => {
                    console.error("Error on the form:", errors);
                    // Aquí puedes mostrar los errores al usuario
                },
            });
        } catch (error) {
            console.error("Error al enviar el formulario:", error);
        } finally {
            // Desactivar loading cuando termine
            // setLoading(false);
        }
    };






    return (
        <div>

            <form onSubmit={handleSubmit}>

                <Label htmlFor="phone">Phone Number</Label>
                <Input
                    type="number"
                    id="phone"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    placeholder="Enter your phone number"
                />

                <Label htmlFor="email">Email</Label>
                <Input
                    type="text"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter your contact email"
                />

                <Label htmlFor="cl">Cover letter</Label>
                <Textarea
                    id="cl"
                    value={coverLetter}
                    onChange={handleCoverLetterChange}
                    placeholder="Why do you want to apply for this job?"
                    rows={5}
                />
                <Label htmlFor="terms">
                    <Checkbox id="terms" />
                    I agree to the terms and conditions
                </Label>
                <Button type="submit" className="mt-4">
                    Apply
                </Button>
            </form>
        </div>


    )
}