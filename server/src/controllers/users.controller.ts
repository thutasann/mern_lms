import { catchAsyncErrors } from '../core/decorators/catcy-async-errrors.decorator';
import { UserRegisterBody } from '../core/dto/user.dto';
import { UserService } from '../services/user.service';

/**
 * User Controllers
 */
export class UserControllers {
	private readonly _userService: UserService;

	@catchAsyncErrors()
	async registerUser(payload: UserRegisterBody) {}
}
