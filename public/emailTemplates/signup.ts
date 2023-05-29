function getTemplate(data: any) {
    console.log(data)
    return `${JSON.stringify(data, null, 2)}\n`

}


export default getTemplate;