"""
Controller para el modelo HistorialMedico.
Arquitectura MVC - Capa de Controladores
"""
from api.models import HistorialMedico
from reportlab.lib import colors
from reportlab.lib.pagesizes import letter
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from io import BytesIO
from datetime import datetime


class HistorialMedicoController:
    """
    Controlador para la lógica de negocio de Historiales Médicos.
    """

    @staticmethod
    def get_all_medical_records(filters=None):
        """Obtiene todos los historiales médicos con filtros opcionales"""
        queryset = HistorialMedico.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).all()
        if filters:
            queryset = queryset.filter(**filters)
        return queryset

    @staticmethod
    def get_medical_record_by_id(record_id):
        """Obtiene un historial médico por ID"""
        return HistorialMedico.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).get(id=record_id)

    @staticmethod
    def get_pet_medical_history(pet_id):
        """Obtiene todo el historial médico de una mascota"""
        return HistorialMedico.objects.filter(
            mascota_id=pet_id
        ).select_related('veterinario').order_by('-fecha')

    @staticmethod
    def create_medical_record(data):
        """Crea un nuevo historial médico"""
        return HistorialMedico.objects.create(**data)

    @staticmethod
    def update_medical_record(record_id, data):
        """Actualiza un historial médico existente"""
        record = HistorialMedico.objects.get(id=record_id)
        for key, value in data.items():
            setattr(record, key, value)
        record.save()
        return record

    @staticmethod
    def delete_medical_record(record_id):
        """Elimina un historial médico"""
        record = HistorialMedico.objects.get(id=record_id)
        record.delete()

    @staticmethod
    def generar_pdf(record_id):
        """
        Genera un PDF profesional con el historial médico completo.

        Args:
            record_id: ID del historial médico

        Returns:
            BytesIO: Buffer con el PDF generado
        """
        # Obtener el historial médico con todas las relaciones
        record = HistorialMedico.objects.select_related(
            'mascota__tutor__usuario',
            'veterinario'
        ).prefetch_related('recetas__medicamento').get(id=record_id)

        # Crear buffer para el PDF
        buffer = BytesIO()

        # Crear documento PDF
        doc = SimpleDocTemplate(
            buffer,
            pagesize=letter,
            rightMargin=72,
            leftMargin=72,
            topMargin=72,
            bottomMargin=18,
        )

        # Contenedor de elementos del PDF
        elements = []

        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=30,
            alignment=TA_CENTER
        )
        heading_style = ParagraphStyle(
            'CustomHeading',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#1e40af'),
            spaceAfter=12,
            spaceBefore=12
        )

        # ENCABEZADO
        elements.append(Paragraph("CLÍNICA VETERINARIA", title_style))
        elements.append(Paragraph("Historial Médico", styles['Heading2']))
        elements.append(Spacer(1, 0.3*inch))

        # INFORMACIÓN DEL PACIENTE
        elements.append(Paragraph("INFORMACIÓN DEL PACIENTE", heading_style))

        pet_data = [
            ['Nombre:', record.mascota.nombre],
            ['Especie:', record.mascota.especie],
            ['Raza:', record.mascota.raza],
            ['Edad:', f"{record.mascota.edad_anios} años" if record.mascota.edad_anios else "N/A"],
            ['Color:', record.mascota.color],
        ]

        pet_table = Table(pet_data, colWidths=[2*inch, 4*inch])
        pet_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(pet_table)
        elements.append(Spacer(1, 0.2*inch))

        # INFORMACIÓN DEL TUTOR
        elements.append(Paragraph("INFORMACIÓN DEL TUTOR", heading_style))

        tutor = record.mascota.tutor
        owner_data = [
            ['Nombre:', tutor.usuario.nombre_completo],
            ['CI:', tutor.ci],
            ['Teléfono:', tutor.usuario.telefono or 'N/A'],
            ['Email:', tutor.usuario.email],
            ['Dirección:', tutor.direccion or 'N/A'],
        ]

        owner_table = Table(owner_data, colWidths=[2*inch, 4*inch])
        owner_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(owner_table)
        elements.append(Spacer(1, 0.3*inch))

        # DETALLES DE LA CONSULTA
        elements.append(Paragraph("DETALLES DE LA CONSULTA", heading_style))

        consultation_data = [
            ['Fecha:', record.fecha.strftime('%d/%m/%Y')],
            ['Tipo:', record.get_tipo_display()],
            ['Veterinario:', record.veterinario.nombre_completo],
        ]

        if record.peso_kg:
            consultation_data.append(['Peso:', f"{record.peso_kg} kg"])
        if record.temperatura_c:
            consultation_data.append(['Temperatura:', f"{record.temperatura_c} °C"])

        consultation_table = Table(consultation_data, colWidths=[2*inch, 4*inch])
        consultation_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e0e7ff')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
            ('GRID', (0, 0), (-1, -1), 1, colors.grey)
        ]))
        elements.append(consultation_table)
        elements.append(Spacer(1, 0.2*inch))

        # DIAGNÓSTICO
        elements.append(Paragraph("DIAGNÓSTICO", heading_style))
        elements.append(Paragraph(record.diagnostico, styles['BodyText']))
        elements.append(Spacer(1, 0.2*inch))

        # TRATAMIENTO
        elements.append(Paragraph("TRATAMIENTO", heading_style))
        elements.append(Paragraph(record.tratamiento, styles['BodyText']))
        elements.append(Spacer(1, 0.2*inch))

        # RECETAS (si hay)
        recetas = record.recetas.all()
        if recetas.exists():
            elements.append(Paragraph("MEDICAMENTOS RECETADOS", heading_style))

            recetas_data = [['Medicamento', 'Dosis', 'Frecuencia', 'Duración']]
            for receta in recetas:
                recetas_data.append([
                    receta.medicamento.nombre,
                    receta.dosis,
                    receta.frecuencia,
                    f"{receta.duracion_dias} días"
                ])

            recetas_table = Table(recetas_data, colWidths=[2*inch, 1.5*inch, 1.5*inch, 1*inch])
            recetas_table.setStyle(TableStyle([
                ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1e40af')),
                ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
                ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
                ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
                ('FONTSIZE', (0, 0), (-1, 0), 11),
                ('BOTTOMPADDING', (0, 0), (-1, 0), 8),
                ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
                ('TEXTCOLOR', (0, 1), (-1, -1), colors.black),
                ('FONTNAME', (0, 1), (-1, -1), 'Helvetica'),
                ('FONTSIZE', (0, 1), (-1, -1), 9),
                ('GRID', (0, 0), (-1, -1), 1, colors.black)
            ]))
            elements.append(recetas_table)
            elements.append(Spacer(1, 0.2*inch))

        # OBSERVACIONES
        if record.observaciones:
            elements.append(Paragraph("OBSERVACIONES", heading_style))
            elements.append(Paragraph(record.observaciones, styles['BodyText']))
            elements.append(Spacer(1, 0.2*inch))

        # PRÓXIMA VISITA
        if record.proxima_visita:
            elements.append(Paragraph("PRÓXIMA VISITA", heading_style))
            elements.append(Paragraph(
                record.proxima_visita.strftime('%d/%m/%Y'),
                styles['BodyText']
            ))
            elements.append(Spacer(1, 0.3*inch))

        # FIRMA
        elements.append(Spacer(1, 0.5*inch))
        elements.append(Paragraph("_" * 40, styles['BodyText']))
        elements.append(Paragraph(
            f"Dr(a). {record.veterinario.nombre_completo}",
            styles['BodyText']
        ))
        elements.append(Paragraph(
            f"Fecha de emisión: {datetime.now().strftime('%d/%m/%Y %H:%M')}",
            styles['BodyText']
        ))

        # Construir PDF
        doc.build(elements)

        # Resetear posición del buffer
        buffer.seek(0)

        return buffer
