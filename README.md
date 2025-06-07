Microfront Multirepo

## Para revisión del proyecto:

# MicrofrontMonorepo

Para revisión del proyecto:
MicrofrontMonorepo
Para revisión del proyecto:

Puntos a cubrir en la rúbrica en este multirepo:

* **Diseño conceptual** (#3): PoC Multirepo añadido Loan (para préstamos)
* **PoC + Servicios** (#4): Loan está consumiendo su propio backend bff-loan
* **Comunicación** (#7): se está usando Pub/Sub para la comunicación entre Loan y Host (Historial de prestamos al usar el microfront de loan se refleja en el host)
* **Contenedores** (#9): se está dockerizando Loan y su backend asociado
* **Otros** (#10) : Se esta usando el patron iFrame para un widget de noticias financieras
  
El resto de la rúbrica se estará tratando en otro proyecto que es https://github.com/diegofisi/microfront-monorepo y se esta cubriendo lo siguiente
* **Diseño conceptual**: (#1) revisar la carpeta `binaries` y la imagen 
* **PoC del monorepo** (#2) App de monorepo con Nx
* **Aplicación Host** (#5) : aplicacion host donde consume los remotos CATALOG PROFILE Y TRANSFERS
* **Aplicaciones** (#6): las aplicaciones remotas son `CATALOG`, `PROFILE` y `TRANSFERS`
* **Comunicación** (#7): uso de contextos - zustand para compartir información entre microfronts
* **Librerías** (#8): uso de librerías personalizadas en `libs/shared` para componente de bienvenida


