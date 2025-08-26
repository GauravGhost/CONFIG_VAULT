import UserRepository from "../repository/user-repository.js";

class UserService {
    private readonly userRepository: UserRepository;
    
    constructor(){
        this.userRepository = new UserRepository();
    }

    public async createUser(data: any): Promise<any> {
        return this.userRepository.create(data);
    }

    public async getUserById(id: string): Promise<any> {
        return this.userRepository.findById(id);
    }

    public async updateUser(id: string, data: any): Promise<any> {
        return this.userRepository.update(id, data);
    }

    public async deleteUser(id: string): Promise<any> {
        return this.userRepository.delete(id);
    }
}

export default UserService;