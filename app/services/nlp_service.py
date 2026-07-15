from app.services.ml_classifier_service import classify_incident_text
from app.services.ml_ner_service import extract_entities_ml


class NLPService:
    def classify_report(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no puede clasificarse")

        classification_result = classify_incident_text(text)

        return {
            "label": classification_result["label_display"],
            "raw_label": classification_result["label"],
            "confidence": classification_result["confidence"],
            "requires_review": classification_result["requires_review"],
            "top_predictions": classification_result["top_predictions"],
            "model_name": "distilbert-multilingual-incident-classifier-v1",
        }

    def extract_entities_rules(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no permite extracción de entidades")

        text_lower = text.lower()
        entities = []

        def add_entity(term: str, label: str):
            start = text_lower.find(term)
            if start != -1:
                entities.append(
                    {
                        "text": text[start : start + len(term)],
                        "label": label,
                        "start_char": start,
                        "end_char": start + len(term),
                        "confidence": 0.90,
                    }
                )

        person_terms = [
            "operario",
            "operador",
            "supervisor",
            "técnico",
            "tecnico",
            "trabajador",
            "personal",
        ]

        area_terms = [
            "planta de producción",
            "planta de produccion",
            "almacén",
            "almacen",
            "laboratorio",
            "zona de carga",
            "producción",
            "produccion",
            "área de despacho",
            "area de despacho",
            "pasillo",
            "pasillo de circulación",
            "pasillo de circulacion",
        ]

        equipment_terms = [
            "montacargas",
            "máquina prensadora",
            "maquina prensadora",
            "máquina",
            "maquina",
            "panel eléctrico",
            "panel electrico",
            "herramienta",
            "banda transportadora",
            "equipo energizado",
        ]

        condition_terms = [
            "cable expuesto",
            "superficie húmeda",
            "superficie humeda",
            "piso húmedo",
            "piso humedo",
            "superficie resbalosa",
            "superficie resbaloso",
            "piso resbaloso",
            "área obstruida",
            "area obstruida",
            "recipiente mal cerrado",
            "señalización deficiente",
            "senalizacion deficiente",
            "desorden general",
            "protección adecuada",
            "proteccion adecuada",
        ]

        substance_terms = [
            "químico",
            "quimico",
            "solvente",
            "ácido",
            "acido",
            "sustancia",
            "líquido inflamable",
            "liquido inflamable",
            "aceite",
            "líquido",
            "liquido",
            "vapores",
        ]

        event_terms = [
            "derrame",
            "caída",
            "caida",
            "descarga",
            "golpe",
            "atrapamiento",
            "resbalón",
            "resbalon",
            "resbaló",
            "resbalo",
            "tropezó",
            "tropezo",
            "fuga",
        ]

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

        entities.sort(key=lambda x: (x["start_char"], x["end_char"]))
        return entities

    def entities_overlap(self, entity_a: dict, entity_b: dict) -> bool:
        return max(entity_a["start_char"], entity_b["start_char"]) < min(
            entity_a["end_char"], entity_b["end_char"]
        )

    def merge_entities(self, ml_entities: list[dict], rule_entities: list[dict]) -> list[dict]:
        merged = list(ml_entities)

        for rule_entity in rule_entities:
            duplicate = False

            for existing in merged:
                same_text = (
                    existing["text"].lower() == rule_entity["text"].lower()
                    and existing["label"] == rule_entity["label"]
                )
                overlap = self.entities_overlap(existing, rule_entity)

                if same_text or overlap:
                    duplicate = True
                    break

            if not duplicate:
                merged.append(rule_entity)

        merged.sort(key=lambda x: (x["start_char"], x["end_char"]))
        return merged

    def extract_entities(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no permite extracción de entidades")

        ml_entities = extract_entities_ml(text)
        rule_entities = self.extract_entities_rules(text)

        return self.merge_entities(ml_entities, rule_entities)

    def _normalize_summary_entity(self, text: str, label: str) -> str:
        value = text.strip().lower()

        if not value:
            return ""

        if label == "PERSONA":
            if value in {
                "operario",
                "operador",
                "trabajador",
                "técnico",
                "tecnico",
                "supervisor",
                "personal",
            }:
                return "personal"

        if label == "AREA":
            if value in {"producción", "produccion", "planta de producción", "planta de produccion"}:
                return "producción"
            if value in {"almacén", "almacen"}:
                return "almacén"
            if value in {"área de despacho", "area de despacho"}:
                return "área de despacho"
            if value == "zona de carga":
                return "zona de carga"
            if value == "laboratorio":
                return "laboratorio"
            if value in {"pasillo de circulación", "pasillo de circulacion"}:
                return "pasillo de circulación"

        if label == "EQUIPO":
            if value in {"máquina", "maquina", "máquina prensadora", "maquina prensadora"}:
                return "maquinaria"
            if value == "herramienta":
                return "herramienta"
            if value == "banda transportadora":
                return "banda transportadora"
            if value in {"panel eléctrico", "panel electrico"}:
                return "panel eléctrico"
            if value == "equipo energizado":
                return "equipo energizado"

        if label == "CONDICION":
            if value == "desorden general":
                return "desorden general"
            if value in {"señalización deficiente", "senalizacion deficiente"}:
                return "señalización deficiente"
            if value in {"piso húmedo", "piso humedo", "superficie húmeda", "superficie humeda"}:
                return "superficie húmeda"
            if value in {"superficie resbalosa", "superficie resbaloso", "piso resbaloso"}:
                return "superficie resbalosa"
            if value == "cable expuesto":
                return "cable expuesto"
            if value == "recipiente mal cerrado":
                return "recipiente mal cerrado"
            if value in {"protección adecuada", "proteccion adecuada"}:
                return "protección adecuada"

        if label == "SUSTANCIA":
            if value in {"químico", "quimico", "sustancia", "solvente"}:
                return "sustancias químicas"
            if value in {"líquido", "liquido", "aceite"}:
                return "líquido derramado"
            if value == "vapores":
                return "vapores"
            if value in {"ácido", "acido"}:
                return "ácido"

        if label == "EVENTO":
            if value in {"resbaló", "resbalo", "resbalón", "resbalon", "caída", "caida", "tropezó", "tropezo"}:
                return "caída"
            if value in {"derrame", "fuga"}:
                return value
            if value == "golpe":
                return "golpe"
            if value == "atrapamiento":
                return "atrapamiento"
            if value == "descarga":
                return "descarga"

        return text.strip()

    def _get_entities_by_label(self, entities: list[dict], label: str) -> list[str]:
        values = []

        for entity in entities:
            if entity["label"] != label:
                continue

            normalized = self._normalize_summary_entity(entity["text"], label)
            if normalized and normalized not in values:
                values.append(normalized)

        return values

    def _join_items(self, items: list[str], limit: int = 3) -> str:
        clean_items = [item for item in items if item]
        if not clean_items:
            return ""

        selected = clean_items[:limit]

        if len(selected) == 1:
            return selected[0]

        if len(selected) == 2:
            return f"{selected[0]} y {selected[1]}"

        return f"{', '.join(selected[:-1])} y {selected[-1]}"

    def _classification_focus_text(self, classification_label: str) -> str:
        if classification_label == "Riesgo de caída":
            return "La narrativa sugiere un escenario asociado a pérdida de estabilidad o superficies resbalosas."
        if classification_label == "Riesgo químico":
            return "El caso apunta a exposición o contacto con sustancias potencialmente peligrosas."
        if classification_label == "Riesgo mecánico":
            return "El incidente se relaciona con interacción insegura con maquinaria, herramientas o partes móviles."
        if classification_label == "Riesgo eléctrico":
            return "El reporte sugiere exposición a cableado, corriente o equipos energizados."
        if classification_label == "Riesgo ergonómico":
            return "La descripción refleja carga física, postura forzada o esfuerzo repetitivo."
        return "El reporte presenta condiciones generales que requieren atención preventiva."

    def build_hybrid_summary(self, text: str, classification_result: dict, entities: list[dict]):
        classification_label = classification_result["label"]

        persons = self._get_entities_by_label(entities, "PERSONA")
        areas = self._get_entities_by_label(entities, "AREA")
        equipments = self._get_entities_by_label(entities, "EQUIPO")
        conditions = self._get_entities_by_label(entities, "CONDICION")
        substances = self._get_entities_by_label(entities, "SUSTANCIA")
        events = self._get_entities_by_label(entities, "EVENTO")

        valid_areas = [
            area
            for area in areas
            if area
            in {
                "producción",
                "almacén",
                "área de despacho",
                "zona de carga",
                "laboratorio",
                "pasillo de circulación",
            }
        ]

        relevant_elements = []

        if persons:
            relevant_elements.extend(persons[:1])

        if events:
            relevant_elements.extend(events[:2])

        if conditions:
            relevant_elements.extend(conditions[:2])

        if substances:
            relevant_elements.extend(substances[:2])

        if equipments:
            relevant_elements.extend(equipments[:2])

        deduplicated_elements = []
        for item in relevant_elements:
            if item not in deduplicated_elements:
                deduplicated_elements.append(item)

        parts = []
        parts.append(f"El reporte fue clasificado como {classification_label.lower()}.")

        if valid_areas:
            parts.append(f"El incidente se ubica en {self._join_items(valid_areas, 2)}.")

        if deduplicated_elements:
            parts.append(
                f"Se identificaron elementos relevantes como {self._join_items(deduplicated_elements, 4)}."
            )

        parts.append(self._classification_focus_text(classification_label))

        if classification_result.get("requires_review"):
            parts.append(
                "La predicción del incidente requiere revisión manual para confirmar la interpretación final."
            )

        content = " ".join(parts)

        return {
            "content": content,
            "model_name": "hybrid-summary-v1",
        }

    def summarize_report(self, text: str):
        if not text or not text.strip():
            raise ValueError("El texto del reporte está vacío y no puede resumirse")

        classification_result = self.classify_report(text)
        entities = self.extract_entities(text)

        return self.build_hybrid_summary(text, classification_result, entities)