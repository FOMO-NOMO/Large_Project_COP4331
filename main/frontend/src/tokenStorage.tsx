export function storeToken( tok:any ) : any
{
    try
    {
        localStorage.setItem('token_data', tok.accessToken);
    }
    catch(e)
    {
        console.log(e);
    }
}
export function retrieveToken() : any
{
    var ud;
    try
    {
        ud = localStorage.getItem('token_data');
    }
    catch(e)
    {
        console.log(e);
    }
    return ud;
}