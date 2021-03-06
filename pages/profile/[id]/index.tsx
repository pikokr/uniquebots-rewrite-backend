import React, { Component } from 'react'
import { NextPageContext } from 'next'
import { getApolloClient } from '../../../lib/apollo'
import { gql } from 'apollo-boost'
import { NextSeo } from 'next-seo'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Tippy from '@tippyjs/react'
import Link from 'next/link'
import BotCard from '../../../components/BotCard'
import { Bot } from '../../../types'
import Image from 'next/image'

class Profile extends Component<any> {
  render() {
    const { user } = this.props
    return (
      <>
        <NextSeo
          title={user.tag}
          openGraph={{
            images: [
              {
                url: user.avatarURL,
              },
            ],
            title: user.tag,
            description: user.description || `${user.tag}님의 프로필입니다.`,
          }}
          description={user.description || `${user.tag}님의 프로필입니다.`}
        />
        <div className="bg-white shadow-xl max-w-xl rounded-xl md:flex mx-auto text-black mt-6 dark:bg-discord-black dark:text-white pt-8 md:p-0">
          <div className="w-32 h-32 md:w-48 md:h-48 relative">
            <Image
              src={user.avatarURL}
              alt="avatar"
              className="md:rounded-l-xl rounded-full md:rounded-none"
              layout="fill"
            />
          </div>
          <div className="md:flex-grow flex flex-col p-2 px-8 md:px-2">
            <div className="text-2xl mx-auto md:mx-0 pb-2">{user.tag}</div>
            <div className="mx-auto md:mx-0 pb-2">
              {user.admin && (
                <Tippy content="관리자">
                  <div className="inline-block">
                    <FontAwesomeIcon
                      icon={['fas', 'user-cog']}
                      className="text-2xl"
                    />
                  </div>
                </Tippy>
              )}
            </div>
            <div className="flex-grow text-center md:text-left">
              {user.description}
            </div>
            <div className="md:ml-auto mx-auto md:mx-0">
              {user.me && (
                <Link href="/editProfile">
                  <div className="p-2 dark:bg-discord-dark rounded-lg cursor-pointer">
                    프로필 수정
                  </div>
                </Link>
              )}
            </div>
          </div>
        </div>
        {(user.bots.length && (
          <div className="mt-6">
            <div className="text-3xl">제작한 봇</div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-2 grid-cols-1">
              {user.bots.map((it: Bot) => (
                <BotCard bot={it} />
              ))}
            </div>
          </div>
        )) ||
          null}
      </>
    )
  }
}

export async function getServerSideProps(ctx: NextPageContext) {
  const apollo = getApolloClient(ctx)
  const data = await apollo.query({
    query: gql`
      query($id: String!) {
        profile(id: $id) {
          id
          tag
          avatarURL
          admin
          description
          bots {
            id
            name
            avatarURL
            slug
            premium
            guilds
            status
            brief
            trusted
            invite
            categories {
              id
              name
            }
          }
        }
        me {
          id
        }
      }
    `,
    variables: {
      id: ctx.query.id,
    },
  })
  if (!data.data.profile) {
    return {
      props: {
        error: 404,
      },
    }
  }
  if (data.data.profile.id === data.data.me?.id) {
    data.data.profile.me = true
  }
  return { props: { user: data.data.profile } }
}

export default Profile
