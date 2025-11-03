export const testController = (req, res) => {
    const {name} = req.body;
    res.status(200).send(`Hello, ${name}! This is a test controller response.`);
}