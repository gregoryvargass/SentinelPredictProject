class NLPService:
    def classify_report(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no puede clasificarse")

        text_lower = text.lower()

        # Riesgo de caída
        fall_keywords = [
            "resbal", "caída", "cayo", "tropez", "resbaló", "suelo", "piso húmedo", "superficie resbalosa"
        ]

        # Riesgo químico
        chemical_keywords = [
            "derrame", "químic", "quimic", "solvente", "ácido", "sustancia", "vapores", "inflamable"
        ]

        # Riesgo mecánico
        mechanical_keywords = [
            "máquina", "maquina", "pieza móvil", "pieza movil", "herramienta", "atrapamiento", "golpe", "banda transportadora"
        ]

        # Riesgo eléctrico
        electrical_keywords = [
            "eléctrico", "electrico", "corriente", "cable", "cortocircuito", "panel eléctrico", "panel electrico", "equipo energizado"
        ]

        # Riesgo ergonómico
        ergonomic_keywords = [
            "carga", "sobreesfuerzo", "postura", "levantamiento", "movimiento repetitivo", "fatiga muscular"
        ]

        if any(keyword in text_lower for keyword in fall_keywords):
            return {
                "label": "Riesgo de caída",
                "confidence": 0.93,
                "model_name": "mvp-rule-classifier-v2"
            }

        if any(keyword in text_lower for keyword in chemical_keywords):
            return {
                "label": "Riesgo químico",
                "confidence": 0.91,
                "model_name": "mvp-rule-classifier-v2"
            }

        if any(keyword in text_lower for keyword in mechanical_keywords):
            return {
                "label": "Riesgo mecánico",
                "confidence": 0.89,
                "model_name": "mvp-rule-classifier-v2"
            }

        if any(keyword in text_lower for keyword in electrical_keywords):
            return {
                "label": "Riesgo eléctrico",
                "confidence": 0.90,
                "model_name": "mvp-rule-classifier-v2"
            }

        if any(keyword in text_lower for keyword in ergonomic_keywords):
            return {
                "label": "Riesgo ergonómico",
                "confidence": 0.88,
                "model_name": "mvp-rule-classifier-v2"
            }

        return {
            "label": "Riesgo general",
            "confidence": 0.80,
            "model_name": "mvp-rule-classifier-v2"
        }

    def extract_entities(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no permite extracción de entidades")

        text_lower = text.lower()
        entities = []

        def add_entity(term: str, label: str):
            start = text_lower.find(term)
            if start != -1:
                entities.append({
                    "text": term,
                    "label": label,
                    "start_char": start,
                    "end_char": start + len(term),
                    "confidence": 0.90
                })

        # PERSONA
        person_terms = ["operario", "operador", "supervisor", "técnico", "tecnico", "trabajador"]

        # AREA
        area_terms = ["planta de producción", "planta de produccion", "almacén", "almacen", "laboratorio", "zona de carga", "producción", "produccion"]

        # EQUIPO
        equipment_terms = ["montacargas", "máquina", "maquina", "panel eléctrico", "panel electrico", "herramienta", "banda transportadora"]

        # CONDICION
        condition_terms = ["líquido", "liquido", "superficie húmeda", "superficie humeda", "piso resbaloso", "área obstruida", "area obstruida", "cable expuesto"]

        # SUSTANCIA
        substance_terms = ["químico", "quimico", "solvente", "ácido", "acido", "sustancia", "líquido inflamable", "liquido inflamable"]

        # EVENTO
        event_terms = ["derrame", "caída", "caida", "descarga", "golpe", "atrapamiento", "resbalón", "resbalon"]

        for term in person_terms:
            add_entity(term, "PERSONA")

        for term in area_terms:
            add_entity(term, "AREA")

        for term in equipment_terms:
            add_entity(term, "EQUIPO")

        for term in condition_terms:
            add_entity(term, "CONDICION")

        for term in substance_terms:
            add_entity(term, "SUSTANCIA")

        for term in event_terms:
            add_entity(term, "EVENTO")

        return entities

    def summarize_report(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no puede resumirse")

        text_lower = text.lower()

        classification = self.classify_report(text)["label"]

        if classification == "Riesgo de caída":
            content = "El reporte describe un incidente asociado a riesgo de caída, vinculado a condiciones inseguras de la superficie o pérdida de estabilidad."
        elif classification == "Riesgo químico":
            content = "El reporte describe un incidente asociado a riesgo químico, relacionado con derrames, sustancias o exposición a agentes peligrosos."
        elif classification == "Riesgo mecánico":
            content = "El reporte describe un incidente asociado a riesgo mecánico, relacionado con maquinaria, herramientas o partes móviles."
        elif classification == "Riesgo eléctrico":
            content = "El reporte describe un incidente asociado a riesgo eléctrico, relacionado con cableado, corriente o equipos energizados."
        elif classification == "Riesgo ergonómico":
            content = "El reporte describe un incidente asociado a riesgo ergonómico, relacionado con carga física, postura o sobreesfuerzo."
        else:
            if len(text) <= 160:
                content = text
            else:
                content = text[:157] + "..."

        return {
            "content": content,
            "model_name": "mvp-rule-summarizer-v2"
        }