export const privacyPolicyContent = (
	<div className="space-y-4 text-sm text-gray-700">
		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">
				1. Responsable del Tratamiento
			</h3>
			<p>
				<strong>Portal SPT</strong> (Spare Parts Trade) es responsable
				del tratamiento de los datos personales recopilados a través de
				esta plataforma B2B, disponible para socios comerciales en{" "}
				<strong>Chile, Perú y Colombia</strong>.
			</p>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">
				2. Datos que Recopilamos
			</h3>
			<p>Al registrarte, recopilamos los siguientes datos:</p>
			<ul className="list-disc list-inside space-y-1 mt-2">
				<li>
					<strong>Identidad personal:</strong> nombre completo, tipo
					de identificación (RUT / RUC / NIT), número de
					identificación personal y empresarial
				</li>
				<li>
					<strong>Empresa:</strong> nombre comercial, país de
					operación
				</li>
				<li>
					<strong>Contacto:</strong> correo electrónico, número de
					teléfono celular
				</li>
				<li>
					<strong>Dirección:</strong> dirección, región, ciudad,
					provincia, código postal (opcionales)
				</li>
				<li>
					<strong>Credenciales:</strong> contraseña (almacenada con
					hash criptográfico, nunca en texto plano)
				</li>
			</ul>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">
				3. Finalidad del Tratamiento
			</h3>
			<p>
				Tus datos serán utilizados <strong>exclusivamente</strong> para:
			</p>
			<ul className="list-disc list-inside space-y-1 mt-2">
				<li>
					Verificar tu identidad como socio comercial y confirmar tu
					cuenta
				</li>
				<li>Gestionar y procesar tus órdenes de repuestos</li>
				<li>Coordinar el despacho y seguimiento de pedidos</li>
				<li>
					Aplicar descuentos personalizados del programa de
					fidelización
				</li>
				<li>Comunicarnos contigo sobre el estado de tus órdenes</li>
				<li>Gestionar tu perfil y datos de envío</li>
			</ul>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">
				4. Terceros que Procesan tus Datos
			</h3>
			<p>
				Para operar la plataforma, trabajamos con los siguientes
				proveedores de confianza:
			</p>
			<ul className="list-disc list-inside space-y-1 mt-2">
				<li>
					<strong>Bsale:</strong> sistema de punto de venta e
					inventario que gestiona el catálogo de productos, carrito y
					proceso de pago inicial. Tus datos de identidad no son
					compartidos con Bsale.
				</li>
				{/* <li>
					<strong>Mercado Pago</strong> — procesador de pagos que
					encripta y gestiona tus datos de pago. Portal SPT nunca
					accede ni almacena datos de tarjetas.
				</li> */}
				<li>
					<strong>Courier de envío:</strong> solo recibirán nombre y
					dirección de despacho, exclusivamente para coordinar la
					entrega de tu pedido.
				</li>
			</ul>
			<p className="mt-2">
				No vendemos, arrendamos ni compartimos tus datos con terceros
				para fines comerciales o publicitarios.
			</p>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">5. Seguridad</h3>
			<p>
				Adoptamos medidas técnicas y organizativas para proteger tus
				datos: cifrado en tránsito (HTTPS/TLS), hashing de contraseñas
				(bcrypt), tokens de autenticación con expiración, y acceso
				administrativo restringido por roles.
			</p>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">
				6. Tus Derechos
			</h3>
			<p>Según la legislación aplicable en tu país, tienes derecho a:</p>
			<ul className="list-disc list-inside space-y-1 mt-2">
				<li>Acceder a los datos personales que tenemos sobre ti</li>
				<li>Rectificar información incorrecta o desactualizada</li>
				<li>
					Solicitar la eliminación de tus datos (derecho al olvido)
				</li>
				<li>
					Oponerte al tratamiento de tus datos en determinadas
					circunstancias
				</li>
			</ul>
			<p className="mt-2 text-xs text-gray-500">
				Chile: Ley 19.628 &nbsp;|&nbsp; Perú: Ley 29733 &nbsp;|&nbsp;
				Colombia: Ley 1581 de 2012
			</p>
			<p className="mt-1">
				Responderemos cualquier solicitud en un plazo máximo de{" "}
				<strong>5 días hábiles</strong>.
			</p>
		</section>

		<section>
			<h3 className="font-semibold text-zinc-900 mb-1">7. Contacto</h3>
			<p>
				Para ejercer tus derechos o consultas sobre privacidad,
				escríbenos a{" "}
				<strong className="text-orange-500">contacto@sptrade.cl</strong>
			</p>
		</section>
	</div>
);
