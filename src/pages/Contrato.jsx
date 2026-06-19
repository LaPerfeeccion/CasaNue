import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";
import styles from "./Contrato.module.css";

export default function Contrato() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [client, setClient] = useState(null);
    const [firma, setFirma] = useState("");
    const [acepta, setAcepta] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        cargarCliente();
    }, []);

    async function cargarCliente() {
        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data } = await supabase
            .from("clients")
            .select("*")
            .eq("id", user.id)
            .single();
        console.log("CLIENTE:", data);
        setClient(data);
    }

    async function firmarContrato() {
        if (!client) return;

        if (!acepta) {
            alert("Debes aceptar el contrato.");
            return;
        }

        if (
            firma.trim().toLowerCase() !==
            client.name.trim().toLowerCase()
        ) {
            alert(
                "La firma debe coincidir exactamente con tu nombre."
            );
            return;
        }

        setLoading(true);

        const ip = "pendiente";

        const { error } = await supabase
            .from("reservations")
            .update({
                contrato_aceptado: true,
                contrato_firmado_en: new Date(),
                firma_nombre: client.name,
                firma_cedula: client.cedula,
                firma_ip: ip
            })
            .eq("id", id);

        setLoading(false);

        if (error) {
            alert(error.message);
            return;
        }
        alert("✅ Contrato firmado correctamente. Tu reserva ha sido registrada.");
        navigate("/");
    }

    if (!client) {
        return <div>Cargando contrato...</div>;
    }

    return (
        <div className={styles.contratoContainer}>
            <h1>Contrato de Reserva - Casa Sanué</h1>

            <div className={styles.datosCliente}>
                <h2>Datos del Titular</h2>

                <p><strong>Nombre:</strong> {client.name}</p>
                <p><strong>Cédula:</strong> {client.cedula}</p>
                <p><strong>Correo:</strong> {client.email}</p>
                <p><strong>WhatsApp:</strong> {client.whatsApp}</p>
            </div>

            <div className={styles.contratoTexto}>
                <h3>1. Objeto del Contrato</h3>

                <p>
                    El presente documento regula la reserva temporal de las
                    instalaciones de Casa Sanué por parte del titular de la
                    reserva identificado anteriormente.
                </p>

                <h3>2. Confirmación de Reserva</h3>

                <p>
                    La reserva quedará sujeta a disponibilidad y a la
                    confirmación del pago correspondiente según las
                    condiciones informadas por Casa Sanué.
                </p>

                <h3>3. Responsabilidad del Titular</h3>

                <p>
                    El titular será responsable de su comportamiento y del
                    comportamiento de todos los acompañantes incluidos en la
                    reserva.
                </p>

                <p>
                    Cualquier daño ocasionado a muebles, instalaciones,
                    equipos, piscina, zonas verdes o cualquier otro elemento
                    de la propiedad deberá ser asumido económicamente por el
                    titular de la reserva.
                </p>

                <h3>4. Consumo de Alcohol</h3>

                <p>
                    Casa Sanué permite el consumo responsable de bebidas
                    alcohólicas por parte de personas autorizadas por la ley.
                </p>

                <p>
                    El titular reconoce que cualquier accidente, lesión o
                    incidente derivado del consumo excesivo de alcohol,
                    sustancias psicoactivas o conductas imprudentes será
                    responsabilidad exclusiva de quienes participen en dichas
                    actividades.
                </p>

                <h3>5. Uso de Piscina</h3>

                <p>
                    El uso de la piscina se realiza bajo responsabilidad de
                    los huéspedes.
                </p>

                <p>
                    Los menores de edad deberán permanecer bajo supervisión
                    permanente de un adulto responsable.
                </p>

                <h3>6. Objetos Personales</h3>

                <p>
                    Casa Sanué no será responsable por pérdida, hurto,
                    deterioro o extravío de dinero, joyas, dispositivos
                    electrónicos u otros objetos personales.
                </p>

                <h3>7. Cancelaciones y Cambios</h3>

                <p>
                    Los pagos realizados como anticipo no son reembolsables.
                    Los cambios de fecha estarán sujetos a disponibilidad y
                    aprobación por parte de Casa Sanué.
                </p>

                <h3>8. Aceptación Electrónica</h3>

                <p>
                    El titular acepta que la digitación de su nombre completo
                    y la aceptación de este documento constituyen una firma
                    electrónica válida para efectos de dejar constancia de su
                    consentimiento respecto de las condiciones aquí
                    establecidas.
                </p>
            </div>

            <div className={styles.firmaBox}>
                <label>Escribe tu nombre completo como firma electrónica</label>
                <input
                    className={styles.inputFirma}
                    type="text"
                    value={firma}
                    onChange={(e) => setFirma(e.target.value)}
                    placeholder={client.name}
                />

                <div className={styles.checkContainer}>
                    <input
                        type="checkbox"
                        checked={acepta}
                        onChange={(e) => setAcepta(e.target.checked)}
                    />
                    <span>He leído y acepto este contrato.</span>
                </div>

                <button
                    className={styles.btnFirmar}
                    onClick={firmarContrato}
                    disabled={loading}
                >
                    {loading ? "Firmando..." : "Firmar Contrato"}
                </button>
            </div>
        </div>
    );
}