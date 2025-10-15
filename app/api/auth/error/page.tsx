export default async function ErrorPage({
    searchParams,
  }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
  }) {
    const error = (await searchParams).error;

    let content = "";

    switch (error) {
        case "Configuration": 
            content = "Houve um erro nas configurações do servidor. Contate o suporte.";
            break;
        case "AccessDenied":
            content = "Você não possui permissão para acessar essa página. Verifique se está utilizando uma conta institucional com permissão para isso!";
            break;
        case "Verification":
            content = "Seu login expirou."
            break;
        default:
            content = "Por favor, contate o suporte."
            break;
    }

    return (
        <div style={{
            display: 'flex',
            gap: '1rem',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <p style={{
                textAlign: 'center',
                maxWidth: '31rem'
            }}>{content}</p>
            <a href="/login">Ir para página de login</a>
        </div>
    )
}