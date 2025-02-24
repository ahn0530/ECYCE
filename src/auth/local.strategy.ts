import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
//AuthService코드와 연결
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy){
    constructor(private authService:AuthService){
        super({usernameField:'id', passwordField:'password'});
    }
    async validate(id: string, password: string): Promise<any> {
        const user = await this.authService.validateUser(id, password);
        if (!user) throw new UnauthorizedException();

        console.log('로그인한 사용자:', user);
        return user;
    }
}