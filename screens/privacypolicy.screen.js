import React, { useEffect, useState } from 'react';
import {Dimensions, Text, StyleSheet, ScrollView,Platform, View} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
const { width,height } = Dimensions.get('screen');
import RenderHtml from 'react-native-render-html'
import { deviceHeight } from '../util/Dimentions';
import { HeaderBackground } from '../components/Background/HeaderBackground';

const PrivacyPolicy = ({navigation}) => {
    var htmlCode = `  <html>
    <head>
      <meta charset='utf-8'>
      <meta name='viewport' content='width=device-width'>
      <title>Privacy Policy</title>
      <style> body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; padding:1em; } </style>
    </head>
    <body>
    <strong>Privacy Policy</strong>
    <p>Pol&iacute;tica de privacidad</p>

    <p>En besseri lo mas importante para nosotros es tu proteccion, por ello nos encargamos de hacer un uso responsable de la informacion personal, ya que no solo protegemos la informacion sino que te damos la seguridad de que besseri se preocupa por ti y tu privacidad.</p>
    
    <h4>IDENTIDAD Y DOMICILIO DEL RESPONSABLE</h4>
    <p>besseri que pertenece a Besser Autopartes SA de cv con domicilio en CALLE B 35, CERVECERA MODELO, NAUCALPAN DE JUAREZ, ESTADO DE MEXICO, CP 53330 es el responsable del tratamiento de los datos de los usuarios y de los visitantes de sus Plataformas. 
    El responsable del tratamiento es quien decide sobre el tratamiento de los datos personales. Para ello determina los fines o usos para los que se utilizará la información personal y los medios que serán utilizados para ese tratamiento.</p>
    
    <h4>DATOS PERSONALES QUE TRATAMOS</h4>
    <p>besseri recolecta tu información personal para que puedas disfrutar de nuestros servicios, y poder mejorarlos de manera continua.</p>
    <p>En algunos casos, la información la facilitas tú mismo, al registrarte o al proveer información cuando utilizas alguno de nuestros servicios. En otros, los recolectamos automáticamente, como cuando navegas por nuestras páginas y utilizas nuestros servicios. </p>
    <p>Estos son los tipos de datos que podríamos recolectar:</p>
    <p>Información que nos proporcionas directamente al registrarte o utilizar nuestros
                servicios:</p>
            <ol>
                <li>Apodo o seudónimo para operar en las plataformas.</li>
                <li>Nombre, imagen personal (foto personal o foto del documento).</li>

                <li>Número de documento o identificación válida</li>
                <li>Información de contacto (como número de teléfono, domicilio, dirección de correo electrónico).</li>
                <li>Datos de cuenta bancaria.</li>

                <li>Información y medios de pago.</li>
                <li>Información sobre los derechos de propiedad intelectual, titularidad de los miembros del programa
                    Brand Protection Program (BPP) e información sobre su actividad como denunciantes.</li>
                <li>Datos biométricos, tales como el análisis de las características biométricas del rostro (tamaño de
                    la
                    cabeza, distancia entre los ojos, el ancho de la nariz, entre otros) con fines de validación de
                    identidad. La huella digital, en caso que la utilices para desbloquear la aplicación, no es
                    recolectada
                    por besseri sino que queda almacenada de manera segura en tus dispositivos.</li>
            </ol>
            <p class="font-weight-bold">Información que recopilamos de manera automática, ya sea que te encuentres
                registrado o no:</p>
            <ol>
                <li>Información de los dispositivos o computadoras desde los que accedes a la plataforma de besseri y
                    otros datos capturados automáticamente (como el tipo o versión del navegador o del sistema
                    operativo,
                    configuraciones, datos de conexión, información sobre algunas de las aplicaciones descargadas y
                    parámetros).</li>
                <li>Dirección IP de internet que utilizas al conectarte a nuestros servicios o al navegar nuestros
                    sitios web.</li>
                <li>
                    Información transaccional y movimientos dentro de las plataformas de besseri (compras, pagos,
                    devoluciones,preguntas, retiros, transferencias, movimientos de la tarjeta pre-paid, créditos
                    tomados,
                    adelantos de dinero, reclamos, facturación, datos fiscales, clave o código de identificación de
                    cuenta
                    digital (CVU, CLABE, etc.), cuentas bancarias, mensajería interna).
                </li>
                <li>
                    Cierta información sobre la actividad de los usuarios y visitantes dentro de nuestro sitio web y las
                    apps. Como por ejemplo, la URL de la que provienen o a qué URL acceden seguidamente (estén o no en
                    nuestro sitio web). También las páginas visitadas, las interacciones con dichas páginas, las
                    búsquedas
                    realizadas, las publicaciones, compras o ventas, calificaciones y réplicas ingresadas, reclamos
                    realizados y recibidos, mensajes en los foros, entre otra información podrá ser almacenada y
                    retenida.
                </li>
                <li>
                    Información sobre tu ubicación (geolocalización), que puede ser utilizada para ofrecerte descuentos,
                    retiro de productos, localizar comercios con QR habilitado para el pago, entre otros.
                </li>
                <li>
                    Listas de contactos de los dispositivos móviles utilizados por los usuarios, para proveer distintos
                    servicios, como envío de dinero entre cuentas.
                </li>
                <li>
                    Vinculaciones entre cuentas y usuarios, con motivo de acciones de prevención del fraude.
                </li>
                <li>
                    Datos para gestión de reclamos y juicios (información para la elaboración de documentos,
                    antecedentes
                    y estrategias).
                </li>
            </ol>
            <h4>TRATAMIENTO DE LA INFORMACION</h4>
            La recolección y tratamiento de tu información personal nos permite prestarte un excelente servicio para
            que puedas realizar operaciones de forma rápida y segura y ofrecerte funcionalidades que se adaptan
            mejor a tus necesidades para:
            <ul>
                <li>◦ Identificarte y contactarte.</li>
                <li>◦ Registrarte en nuestros sistemas.</li>
                <li>◦ Verificar tu identidad en cumplimiento de exigencias legales.</li>
                <li>◦ Validar, actualizar y corregir tu información.</li>
                <li>◦ Brindarte los productos, servicios y/o beneficios que solicitas o contratas con nosotros.</li>
                <li>◦ Facilitarte entrar en contacto directo con el vendedor o comprador para efectos de la transacción
                    que
                    querés realizar.</li>
                <li>
                    ◦ Elaborar y mantener un registro de las operaciones que realices, así como informarte acerca de las
                    mismas y darle seguimiento correspondiente.
                </li>


                <li>◦ Atender tus comentarios, quejas y sugerencias, así como brindarte soporte.</li>
                <li>◦ Cobranza judicial y/o extrajudicial.</li>
                <li>◦ Facilitar el envío de productos anunciados en sitios web, aplicaciones y demás plataformas de
                    comercio
                    electrónico.</li>
                <li>◦ Ofrecerte servicios y funcionalidades que se adecuen mejor a tus necesidades, y personalizar
                    nuestros
                    servicios para hacer que tus experiencias sean extraordinarias.</li>
                <li>
                    ◦ Posibilitarte la participación en concursos, subastas o sorteos, en caso de realizarlos y de que
                    te
                    sean aplicables, así como notificarte si resultaras ganador, lo anterior siempre en cumplimiento a
                    la
                    normativa aplicable a sorteos y concursos.
                </li>
                <li>
                    ◦ Contribuir a la seguridad de las relaciones, comunicaciones y transacciones entre los usuarios de
                    nuestra plataforma.
                </li>
                <li>
                    ◦ Elaborar un sistema de reputación de usuarios, para beneficio de los consumidores.
                </li>
                <li>
                    ◦ Desarrollar estudios internos y estadísticos sobre tus intereses y comportamientos, para ofrecerte
                    mejores servicios y productos.
                </li>
                <li>
                    ◦ Elaborar perfiles mediante el análisis de diversas variables, como la conducta o las interacciones
                    dentro de la plataforma, el análisis y predicción de la capacidad económica, preferencias,
                    intereses,
                    historial de transacciones, comportamiento y ubicación, entre otros, para mejorar nuestras
                    iniciativas
                    comerciales y promocionales, mostrar publicidad o promociones, banners de interés, noticias.
                </li>
                <li>
                    ◦ Ofrecerte servicios y funcionalidades que se adecuen a tus necesidades para brindarte una mejor
                    experiencia.
                </li>
                <li>
                    ◦ Mejorar nuestras iniciativas comerciales y promocionales y analizar las páginas visitadas, las
                    búsquedas realizadas por los usuarios, para mejorar nuestra oferta de contenidos y artículos,
                    personalizar dichos contenidos, su presentación y servicios.
                </li>
                <li>
                    ◦ Brindarte información a través de diferentes canales (por correo electrónico, mensajes cortos de
                    texto
                    (SMS), mensajes push, llamada telefónica o cualquier otro medio) sobre mejoras o nuevas funciones o
                    servicios de la plataforma.
                </li>
                <li>
                    ◦ Buscar tu fidelización mediante un programa de beneficios.
                </li>
                <li>
                    ◦ Cumplir con la normativa que le sea aplicable a besseri en general.
                </li>
                <li>
                    ◦ Cumplimiento de normativa de Prevención de Lavado de Dinero y Financiamiento del Terrorismo
                    (acciones
                    de validación de identidad, verificación de usuarios (KYC), verificación de identidad contra de
                    Personas
                    Expuestas Políticamente, verificación de perfil e historial transaccional, en cumplimiento de la
                    regulación aplicable en materia de prevención de lavado de dinero, verificación contra listas OFAC y
                    otras), según sea aplicable en cada país.
                </li>
                <li>
                    ◦ Cumplimiento de regímenes informativos en general, según sea aplicable en cada país.
                </li>
                <li>
                    ◦ Cumplimiento de regímenes fiscales de recaudación, registración, información, auditoría y
                    facturación,
                    a cualquier nivel de gobierno (por ejemplo: nivel federal, estadual y municipal).
                </li>
                <li>
                    ◦ Cumplimiento de requerimientos informativos de autoridades administrativas o judiciales
                    competentes.
                </li>
                <li>◦ Suministrar información de usuarios a entidades gubernamentales con acuerdos de colaboración para
                    el
                    cumplimiento de sus competencias.</li>
                <li>
                    ◦ Hacer que las plataformas crezcan de una manera sustentable y segura mediante herramientas y
                    acciones
                    de prevención del fraude y delitos relacionados.
                </li>
                <li>
                    ◦ Entrenar el modelo de algoritmo de detección y prevención automatizada del fraude.
                </li>
            </ul>
            <h4>RESGUARDO DE LA INFORMACION</h4> 
            El resguardo de tu privacidad es muy importante para Mercado Libre. Por ello, no vendemos ni
            comercializamos información que identifique a nuestros usuarios. Tampoco compartimos o transferimos de
            ningún otro modo tu información personal a terceros.
            Los servicios que brinda besseri requieren del soporte de una infraestructura tecnológica, como
            servidores y servicios en la nube, que pueden ser propios o provistos por terceros.
            Parte de esa infraestructura puede estar establecida en un país diferente al tuyo.
            También puede ocurrir que los destinatarios de los datos indicados anteriormente en la sección “¿Cómo
            compartimos la información personal?” se encuentren en un país distinto.
            Puede que los países receptores de los datos que transferimos no ofrezcan niveles adecuados de
            protección de datos personales, conforme la normativa aplicable.
            En estos casos, besseri adopta medidas para resguardar tus datos, mediante cláusulas contractuales o
            normas corporativas vinculantes que imponen las mismas medidas de protección que las que se describen en
            esta Declaración de Privacidad.



            <h4>DURACION DE LA INFORMACION</h4>
            Solo almacenaremos la información personal durante el tiempo necesario para cumplir con el propósito
            para el que se ha recopilado, para cumplir con requisitos reglamentarios o legales, o durante el periodo
            de prescripción legal de posibles responsabilidades legales o contractuales.
            Una vez concluido el lapso, los datos serán eliminados o anonimizados de manera tal que no pueda ser
            individualizada ninguna persona, según lo permita la normativa de cada país.

            <h4>RESPONSABILIDA DEL USUARIO</h4>
            Haremos todo lo que esté a nuestro alcance para proteger la privacidad de tu información personal. El
            usuario será responsable de todos los actos que tengan lugar mediante el uso de su apodo y clave. Si por
            cualquier razón creyeras que alguien puede conocer tu clave, deberás modificarla ingresando a la
            aplicación.

            <h4>¿Cómo puedes ejercer tus derechos para controlar tu información personal?</h4>
            La normativa aplicable te confiere ciertos derechos sobre tu información personal, los cuales podrás
            consultar según se especifica en el anexo de cada país, como por ejemplo: (i) acceso; (ii)
            actualización; (iii) rectificación; (iv) el cese en el envío de publicidades, ofertas y promociones; (v)
            supresión; (vi) revocación del consentimiento; (vii) confidencialidad y (viii) revisión de decisiones
            automatizadas.
            Podrás hacer consultas y/o peticiones relativas a tu información personal comunicandote con nosotros a
            nuestros medios a través de los datos de contacto provistos en nuestro sitio web.
            En determinados casos, y siempre que así lo permita o lo imponga la legislación aplicable, mantendremos
            en nuestros archivos la información personal que nos hayas pedido que suprimamos por un plazo limitado
            en el tiempo. Una vez cumplido ese plazo, procederemos a suprimir tu información personal.

            <h4>SEGURIDAD DE LA INFORMACION</h4>
            Besseri cumple con la normativa y ha adoptado medidas de seguridad siguiendo los estándares de la
            industria para proteger tu información personal.
            En la medida en que besseri haya cumplido con las normas y adoptado las medidas mencionadas en el
            apartado anterior, no se hace responsable por interceptaciones ilegales o violaciones de sus sistemas o
            bases de datos, ni por su utilización por parte de personas no autorizadas. besseri tampoco se hace
            responsable por la indebida utilización de la información obtenida por esos medios.


            <h4>Ley Aplicable y Jurisdicción</h4>
            La Declaración de Privacidad y el presente se regirán por las leyes de los Estados Unidos Mexicanos.Ante
            cualquier controversia o divergencia relacionada con la interpretación, validez o cumplimiento de estas,
            tú y besseri declaran que se someten a la jurisdicción exclusiva de las autoridades competentes de
            México.

            </p>
  </body>
    </html>
`;
  return (
    <View style={styles.container}>
      <HeaderBackground/>
    <View
     style={styles.header}
    > 
      <Text style={{...CommonStyles.fontFamily,color:Colors.white}}>{'Privacy Policy'}</Text>
    </View>
    <ScrollView contentContainerStyle={{flexGrow:1,padding:5}}>
                <RenderHtml
            contentWidth={width}
            source={{html:htmlCode}}
          />
            </ScrollView>
   
  
   </View>
  );
};
const styles = StyleSheet.create({
 container:{
   flex:1,
   backgroundColor:Colors.white
 },
 header:{
  width: '100%',
  height: Platform.OS == 'ios' ? deviceHeight * 0.15 : deviceHeight * 0.10,
  //  borderWidth:1,
  ...CommonStyles.horizontalCenter,
  justifyContent:'center'
 },
 profileBtn:{
   width:'95%',
   height:55,
   borderWidth:1,
   borderColor:Colors.brightBlue,
   backgroundColor:Colors.brightBlue,
   ...CommonStyles.verticalCenter,
   ...CommonStyles.horizontalCenter,
   borderRadius:3,
   alignSelf:'center',
   margin:10
 },

})
export default PrivacyPolicy;
