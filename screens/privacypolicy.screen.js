import React, { useEffect, useState } from 'react';
import {Dimensions, Text, StyleSheet, ScrollView,TouchableOpacity, View} from 'react-native';
import Colors from '../util/styles/colors';
import CommonStyles from '../util/styles/styles';
const { width,height } = Dimensions.get('screen');
import RenderHtml from 'react-native-render-html'
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

<p>El sitio web besseri.com es propiedad de Besser Autopartes S. A de C.V, que es un controlador de datos de tus datos personales.</p>

<p>Hemos adoptado esta Pol&iacute;tica de privacidad, que determina c&oacute;mo procesamos la informaci&oacute;n recopilada por besseri.com, que tambi&eacute;n proporciona las razones por las que debemos recopilar ciertos datos personales sobre ti. Por lo tanto, debes leer esta Pol&iacute;tica de privacidad antes de usar el sitio web de besseri.com.</p>

<p>Cuidamos tus datos personales y nos comprometemos a garantizar su confidencialidad y seguridad. Informaci&oacute;n personal que recopilamos:</p>

<p>Cuando visitas besseri.com, recopilamos autom&aacute;ticamente cierta informaci&oacute;n sobre tu dispositivo, incluida informaci&oacute;n sobre tu navegador web, direcci&oacute;n IP, zona horaria y algunas de las cookies instaladas en tu dispositivo. Adem&aacute;s, a medida que navegas por el sitio, recopilamos informaci&oacute;n sobre las p&aacute;ginas web individuales o los productos que ves, qu&eacute; sitios web o t&eacute;rminos de b&uacute;squeda te remitieron al sitio y c&oacute;mo interact&uacute;as con &eacute;l. Nos referimos a esta informaci&oacute;n recopilada autom&aacute;ticamente como &quot;Informaci&oacute;n del dispositivo&quot;. Adem&aacute;s, podemos recopilar los datos personales que nos proporcionas (incluidos, entre otros, nombre, apellido, direcci&oacute;n, informaci&oacute;n de pago, etc.) durante el registro para poder cumplir con el acuerdo. &iquest;Por qu&eacute; procesamos tus datos?</p>

<p>Nuestra m&aacute;xima prioridad es la seguridad de los datos del cliente y, como tal, podemos procesar solo los datos m&iacute;nimos del usuario, solo en la medida en que sea absolutamente necesario para mantener el sitio web. La informaci&oacute;n recopilada autom&aacute;ticamente se utiliza solo para identificar casos potenciales de abuso y establecer informaci&oacute;n estad&iacute;stica sobre el uso del sitio web. Esta informaci&oacute;n estad&iacute;stica no se agrega de tal manera que identifique a ning&uacute;n usuario en particular del sistema.</p>

<p>Puedes visitar el sitio sin decirnos qui&eacute;n eres ni revelar ninguna informaci&oacute;n por la cual alguien pueda identificarte como una persona espec&iacute;fica. Sin embargo, si deseas utilizar algunas de las funciones del sitio web, o deseas recibir nuestro bolet&iacute;n informativo o proporcionar otros detalles al completar un formulario, puedes proporcionarnos datos personales, como tu correo electr&oacute;nico, nombre, apellido, ciudad de residencia, organizaci&oacute;n y n&uacute;mero de tel&eacute;fono. Puedes optar por no proporcionar tus datos personales, pero es posible que no puedas aprovechar algunas de las funciones del sitio web. Por ejemplo, no podr&aacute;s recibir nuestro bolet&iacute;n ni contactarnos directamente desde el sitio web. Los usuarios que no est&eacute;n seguros de qu&eacute; informaci&oacute;n es obligatoria pueden ponerse en contacto con nosotros a trav&eacute;s de legal@besseri.com. Tus derechos:</p>

<p>Si eres residente europeo, tienes los siguientes derechos relacionados con tus datos personales:</p>

<p> El derecho a ser informado.  El derecho de acceso.  El derecho a la rectificaci&oacute;n.  El derecho a borrar.  El derecho a restringir el procesamiento.  El derecho a la portabilidad de datos.  El derecho a oponerte.  Derechos en relaci&oacute;n con la toma de decisiones automatizada y la elaboraci&oacute;n de perfiles.</p>

<p>Si deseas ejercer este derecho, comun&iacute;cate con nosotros a trav&eacute;s de la informaci&oacute;n de contacto a continuaci&oacute;n.</p>

<p>Adem&aacute;s, si eres residente europeo, destacamos que estamos procesando tu informaci&oacute;n para cumplir con los contratos que podr&iacute;amos tener contigo (por ejemplo, si realizas un pedido a trav&eacute;s del sitio), o de otra manera para seguir nuestros intereses comerciales leg&iacute;timos enumerados anteriormente. Adem&aacute;s, ten en cuenta que tu informaci&oacute;n puede transferirse fuera de Europa, incluidos Canad&aacute; y Estados Unidos. Enlaces a otros sitios web:</p>

<p>Nuestro sitio puede contener enlaces a otros sitios web que no son de nuestra propiedad ni est&aacute;n controlados por nosotros. Ten en cuenta que no somos responsables de dichos sitios web ni de las pr&aacute;cticas de privacidad de terceros. Te recomendamos que est&eacute;s atento cuando abandones nuestro sitio web y leas las declaraciones de privacidad de cada sitio que pueda recopilar informaci&oacute;n personal. Seguridad de la informaci&oacute;n:</p>

<p>Aseguramos la informaci&oacute;n que proporcionas en servidores inform&aacute;ticos en un entorno controlado y seguro, protegido del acceso, uso o divulgaci&oacute;n no autorizados. Mantenemos medidas de seguridad administrativas, t&eacute;cnicas y f&iacute;sicas razonables para proteger contra el acceso no autorizado, el uso, la modificaci&oacute;n y la divulgaci&oacute;n de datos personales bajo su control y custodia. Sin embargo, no se puede garantizar la transmisi&oacute;n de datos a trav&eacute;s de Internet o redes inal&aacute;mbricas. Divulgaci&oacute;n legal:</p>

<p>Divulgaremos cualquier informaci&oacute;n que recopilemos, usemos o recibamos si as&iacute; lo requiere o lo permite la ley, como para cumplir con una citaci&oacute;n o un proceso legal similar, y cuando creemos de buena fe que la divulgaci&oacute;n es necesaria para proteger nuestros derechos, proteger tu seguridad o la seguridad de los dem&aacute;s, investigar el fraude o responder a una solicitud del gobierno. Informaci&oacute;n de contacto:</p>

<p>Si deseas comunicarte con nosotros para comprender m&aacute;s sobre esta Pol&iacute;tica o deseas comunicarte con nosotros en relaci&oacute;n con cualquier asunto sobre los derechos individuales y tu informaci&oacute;n personal, puedes enviarnos un correo electr&oacute;nico a legal@besseri.com.</p>
    </body>
    </html>
`;
  return (
   <View style={styles.container}>
    <View style={styles.header}> 
    <Text style={{...CommonStyles.fontFamily}}>{'Privacy Policy'}</Text>
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
   width:'100%',
   height:65,
   borderWidth:1,
   borderColor:Colors.primaryColor,
   backgroundColor:Colors.primaryColor,
   ...CommonStyles.horizontalCenter,
   ...CommonStyles.verticalCenter
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
