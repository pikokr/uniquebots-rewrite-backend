import fetch from 'node-fetch'
import { Arg, Ctx, Mutation, Query, Resolver } from 'type-graphql'
// @ts-ignore
import * as config from '../../config.json'
import Util from '../Util'
import { URLSearchParams } from 'url'
import jwt from 'jsonwebtoken'
import User from '../types/User'
import Category from '../types/Category'
import Library from '../types/Library'

@Resolver()
export default class {
  @Query((returns) => User, { nullable: true })
  me(@Ctx() ctx) {
    return ctx.user
  }

  @Query((returns) => User, { nullable: true })
  async profile(@Arg('id') id: string) {
    const user = await Util.getUser(id)
    return user ? { id: user.id } : null
  }

  @Query((returns) => [Category])
  async categories() {
    const categories = await Util.prisma.category.findMany()
    return categories
  }

  @Query((returns) => [Library])
  async libraries() {
    const libraries = await Util.prisma.library.findMany()
    return libraries
  }

  @Query((returns) => String)
  loginURL() {
    return (
      Util.DISCORD_API_ENDPOINT +
      `/oauth2/authorize?client_id=${config.oauth2.clientID}&redirect_uri=${config.oauth2.redirectURI}&scope=identify&response_type=code`
    )
  }

  @Mutation((returns) => String, { nullable: true })
  async login(@Arg('code') code: string, @Ctx() ctx) {
    if (ctx.user) return null
    const params = new URLSearchParams({
      client_id: config.oauth2.clientID,
      code,
      client_secret: config.oauth2.clientSecret,
      redirect_uri: config.oauth2.redirectURI,
      grant_type: 'authorization_code',
      scope: 'identify',
    })
    const res = await fetch(Util.DISCORD_API_ENDPOINT + '/oauth2/token', {
      body: params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      method: 'POST',
    })
    const json = await res.json()
    if (res.status !== 200) return null
    if (!json.access_token) return null
    const user = await Util.safeFetch(
      Util.DISCORD_API_ENDPOINT + '/users/@me',
      {
        headers: {
          Authorization: `${json.token_type} ${json.access_token}`,
        },
      },
    )
    const json2 = await user.json()
    if (user.status !== 200) return null
    await Util.prisma.user.upsert({
      create: {
        id: json2.id,
        username: json2.username,
        discriminator: json2.discriminator,
        avatar: json2.avatar,
      },
      update: {
        username: json2.username,
        discriminator: json2.discriminator,
        avatar: json2.avatar,
      },
      where: {
        id: json2.id,
      },
    })
    return jwt.sign({ id: json2.id, ...json }, config.jwtSecret)
  }
}
