import { hash, genSalt, compare } from 'bcrypt';

const SALT_RANDOMS = 8;

// Gera a senha criptografada (Hash) para salvar no banco
const hashPassword = async (password) => {
    const saltGenerated = await genSalt(SALT_RANDOMS);
    return await hash(password, saltGenerated);
};

// Compara a senha digitada no login com a senha criptografada do banco
const verifyPassword = async (password, hashedPassword) => {
    return await compare(password, hashedPassword);
};

export const PasswordCrypto = {
    hashPassword,
    verifyPassword
};