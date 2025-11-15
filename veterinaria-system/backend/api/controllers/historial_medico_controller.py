"""
Controller para HistorialMedico - Arquitectura MVC
"""
from rest_framework import viewsets
from rest_framework.decorators import action
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.enums import TA_CENTER
from io import BytesIO
import datetime
from ..models import HistorialMedico
from ..serializers import HistorialMedicoSerializer


class HistorialMedicoViewSet(viewsets.ModelViewSet):
    """
    ViewSet para gestionar historiales médicos.
    Endpoints:
    - GET /api/historiales/
    - POST /api/historiales/
    - GET /api/historiales/{id}/
    - PUT /api/historiales/{id}/
    - DELETE /api/historiales/{id}/
    - GET /api/historiales/{id}/generar_pdf/ (custom action)
    """
    queryset = HistorialMedico.objects.select_related(
        'mascota__tutor__usuario',
        'veterinario'
    ).all()
    serializer_class = HistorialMedicoSerializer
    filterset_fields = ['mascota', 'veterinario', 'tipo', 'fecha']

    @action(detail=True, methods=['get'])
    def generar_pdf(self, request, pk=None):
        """
        Genera un PDF con el historial médico.
        GET /api/historiales/{id}/generar_pdf/
        """
        historial = self.get_object()

        # Crear buffer
        buffer = BytesIO()
        doc = SimpleDocTemplate(buffer, pagesize=letter, rightMargin=72, leftMargin=72,
                                topMargin=72, bottomMargin=18)

        # Estilos
        styles = getSampleStyleSheet()
        title_style = ParagraphStyle(
            'CustomTitle',
            parent=styles['Heading1'],
            fontSize=18,
            textColor=colors.HexColor('#2c3e50'),
            spaceAfter=20,
            alignment=TA_CENTER,
            fontName='Helvetica-Bold'
        )

        # Contenedor de elementos
        elements = []

        # Encabezado - Nombre del centro
        titulo = Paragraph("Centro Veterinario Comunitario", title_style)
        elements.append(titulo)
        elements.append(Spacer(1, 0.3*inch))

        # Título del documento
        subtitle_style = ParagraphStyle(
            'Subtitle',
            parent=styles['Heading2'],
            fontSize=14,
            textColor=colors.HexColor('#34495e'),
            spaceAfter=12,
            alignment=TA_CENTER
        )
        subtitle = Paragraph("Historial Médico", subtitle_style)
        elements.append(subtitle)
        elements.append(Spacer(1, 0.2*inch))

        # Información del paciente
        info_data = [
            ['Paciente (Mascota):', historial.mascota.nombre],
            ['Especie:', historial.mascota.especie],
            ['Raza:', historial.mascota.raza],
            ['Tutor:', historial.mascota.tutor.usuario.nombre_completo],
            ['Fecha de consulta:', historial.fecha.strftime('%d/%m/%Y')],
            ['Tipo de consulta:', historial.tipo],
        ]

        info_table = Table(info_data, colWidths=[2*inch, 4*inch])
        info_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#ecf0f1')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))

        elements.append(info_table)
        elements.append(Spacer(1, 0.3*inch))

        # Detalles médicos
        detalles_data = [
            ['Diagnóstico:', historial.diagnostico],
            ['Tratamiento:', historial.tratamiento],
        ]

        if historial.medicamentos:
            detalles_data.append(['Medicamentos:', historial.medicamentos])
        if historial.peso_kg:
            detalles_data.append(['Peso:', f'{historial.peso_kg} kg'])
        if historial.temperatura_c:
            detalles_data.append(['Temperatura:', f'{historial.temperatura_c} °C'])
        if historial.observaciones:
            detalles_data.append(['Observaciones:', historial.observaciones])

        detalles_table = Table(detalles_data, colWidths=[2*inch, 4*inch])
        detalles_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.HexColor('#e8f5e9')),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (0, -1), 'RIGHT'),
            ('ALIGN', (1, 0), (1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (0, -1), 'Helvetica-Bold'),
            ('FONTNAME', (1, 0), (1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 10),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.grey),
            ('VALIGN', (0, 0), (-1, -1), 'TOP'),
            ('LEFTPADDING', (0, 0), (-1, -1), 12),
            ('RIGHTPADDING', (0, 0), (-1, -1), 12),
            ('TOPPADDING', (0, 0), (-1, -1), 8),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
        ]))

        elements.append(detalles_table)
        elements.append(Spacer(1, 0.5*inch))

        # Firma del veterinario
        firma_data = [
            ['', ''],
            ['', ''],
            ['____________________________', ''],
            [f'Dr(a). {historial.veterinario.nombre_completo}', ''],
            ['Médico Veterinario', ''],
            [f'Fecha: {datetime.datetime.now().strftime("%d/%m/%Y")}', '']
        ]

        firma_table = Table(firma_data, colWidths=[3*inch, 3*inch])
        firma_table.setStyle(TableStyle([
            ('ALIGN', (0, 0), (0, -1), 'CENTER'),
            ('FONTNAME', (0, 2), (0, 2), 'Helvetica'),
            ('FONTNAME', (0, 3), (0, 4), 'Helvetica-Bold'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ]))

        elements.append(firma_table)

        # Construir PDF
        doc.build(elements)

        # Obtener el PDF del buffer
        pdf = buffer.getvalue()
        buffer.close()

        # Crear respuesta HTTP
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="historial_{historial.id}_{historial.mascota.nombre}.pdf"'
        response.write(pdf)

        return response
